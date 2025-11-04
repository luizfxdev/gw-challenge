#!/bin/bash

# ======================== CONFIGURAÇÕES INICIAIS ========================
# Define cores para output mais legível
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis de configuração
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="minhasenha123"
POSTGRES_DB="gwchallenge"
BACKEND_PORT=8080
FRONTEND_PORT=3000
BACKEND_TIMEOUT=60
FRONTEND_TIMEOUT=30

# ======================== FUNÇÕES AUXILIARES ========================

# Função para exibir mensagens coloridas
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para limpar recursos ao encerrar
cleanup() {
    echo ""
    print_warning "Encerrando aplicações..."
    
    # Mata os processos filhos
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    
    # Mata processos específicos
    pkill -9 -f "spring-boot:run" 2>/dev/null
    pkill -9 -f "next dev" 2>/dev/null
    pkill -9 node 2>/dev/null
    
    print_success "Aplicações encerradas"
    exit 0
}

# Trap para capturar sinais de interrupção (Ctrl+C)
trap cleanup SIGINT SIGTERM

# ======================== VALIDAÇÕES INICIAIS ========================

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 Iniciando GW Challenge - Fullstack${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Verifica se está na raiz do projeto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Execute este script na raiz do projeto gw-challenge/"
    print_error "Estrutura esperada: ./backend e ./frontend"
    exit 1
fi

print_success "Estrutura do projeto validada"
echo ""

# ======================== LIBERAR PORTAS ========================

print_info "Liberando portas (método agressivo)..."

# Mata todos os processos Node.js
print_info "   Matando todos os processos Node.js..."
pkill -9 node 2>/dev/null
pkill -9 npm 2>/dev/null
pkill -9 next 2>/dev/null

# Aguarda processos morrerem
sleep 2

# Libera portas específicas usando fuser
print_info "   Liberando portas com fuser..."
for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 8080; do
    sudo fuser -k $port/tcp 2>/dev/null
done

# Aguarda mais um pouco
sleep 2

# Verifica se porta 3000 está livre
if netstat -tuln 2>/dev/null | grep -q ":3000 "; then
    print_warning "Porta 3000 ainda ocupada! Tentando com ss..."
    PID=$(sudo ss -lptn 'sport = :3000' 2>/dev/null | grep -oP 'pid=\K[0-9]+' | head -1)
    if [ ! -z "$PID" ]; then
        print_info "   Matando processo PID: $PID"
        sudo kill -9 $PID 2>/dev/null
        sleep 1
    fi
fi

print_success "Portas liberadas"
echo ""

# ======================== INICIAR POSTGRESQL ========================

print_info "Verificando PostgreSQL..."

# Inicia o PostgreSQL
sudo pg_ctlcluster 16 main start > /dev/null 2>&1

# Aguarda o PostgreSQL iniciar
sleep 2

# Testa conexão com PostgreSQL (sem senha, pois usa peer authentication)
if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "PostgreSQL 16 rodando"
else
    print_error "PostgreSQL não iniciou"
    exit 1
fi

# Verifica se o banco de dados existe
if sudo -u postgres psql -d "$POSTGRES_DB" -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Conexão com banco '$POSTGRES_DB' OK"
else
    print_warning "Banco '$POSTGRES_DB' não existe. Criando..."
    
    # Cria o banco de dados
    sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Banco de dados '$POSTGRES_DB' criado"
    else
        print_error "Falha ao criar banco de dados"
        exit 1
    fi
fi

echo ""

# ======================== INICIAR BACKEND ========================

print_info "Iniciando Backend (Spring Boot)..."

cd backend

# Remove log anterior
rm -f ../backend.log

# Inicia o backend com Maven
if [ -f "mvnw" ]; then
    ./mvnw spring-boot:run > ../backend.log 2>&1 &
else
    mvn spring-boot:run > ../backend.log 2>&1 &
fi

BACKEND_PID=$!
cd ..

print_info "Aguardando backend inicializar (até $BACKEND_TIMEOUT segundos)..."

BACKEND_STARTED=false

# Loop de espera pelo backend
for i in $(seq 1 $BACKEND_TIMEOUT); do
    # Verifica se o processo ainda está rodando
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo ""
        print_error "Backend crashou durante inicialização!"
        echo ""
        print_info "Últimas linhas do log:"
        tail -n 20 backend.log
        exit 1
    fi
    
    # Verifica se a porta 8080 está aberta e respondendo
    if netstat -tuln 2>/dev/null | grep -q ":$BACKEND_PORT "; then
        if curl -s http://localhost:$BACKEND_PORT/api/packages > /dev/null 2>&1; then
            BACKEND_STARTED=true
            echo ""
            print_success "Backend iniciado com sucesso!"
            break
        fi
    fi
    
    echo -n "."
    sleep 1
done

# Se backend não iniciou, exibe erro
if [ "$BACKEND_STARTED" = false ]; then
    echo ""
    print_error "Backend não iniciou em $BACKEND_TIMEOUT segundos!"
    echo ""
    print_info "Últimas linhas do log:"
    tail -n 30 backend.log
    echo ""
    print_info "Dica: Verifique o log completo com: cat backend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""

# ======================== VERIFICAR PORTA 3000 NOVAMENTE ========================

print_info "Verificando porta $FRONTEND_PORT antes de iniciar frontend..."

if netstat -tuln 2>/dev/null | grep -q ":$FRONTEND_PORT "; then
    print_error "Porta $FRONTEND_PORT ainda está ocupada!"
    print_info "Processos usando a porta:"
    sudo ss -lptn "sport = :$FRONTEND_PORT" 2>/dev/null
    echo ""
    print_info "Execute manualmente: sudo fuser -k $FRONTEND_PORT/tcp"
    cleanup
    exit 1
fi

print_success "Porta $FRONTEND_PORT está livre"
echo ""

# ======================== INICIAR FRONTEND ========================

print_info "Iniciando Frontend (Next.js)..."

cd frontend

# Remove log anterior
rm -f ../frontend.log

# Inicia o frontend com Next.js na porta específica
PORT=$FRONTEND_PORT npm run dev > ../frontend.log 2>&1 &

FRONTEND_PID=$!
cd ..

print_info "Aguardando frontend inicializar na porta $FRONTEND_PORT (até $FRONTEND_TIMEOUT segundos)..."

FRONTEND_STARTED=false

# Loop de espera pelo frontend
for i in $(seq 1 $FRONTEND_TIMEOUT); do
    # Verifica se o processo ainda está rodando
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo ""
        print_error "Frontend crashou durante inicialização!"
        echo ""
        print_info "Últimas linhas do log:"
        tail -n 20 frontend.log
        cleanup
        exit 1
    fi
    
    # Verifica se a porta 3000 está aberta
    if netstat -tuln 2>/dev/null | grep -q ":$FRONTEND_PORT "; then
        FRONTEND_STARTED=true
        echo ""
        print_success "Frontend iniciado com sucesso na porta $FRONTEND_PORT!"
        break
    fi
    
    echo -n "."
    sleep 1
done

# Se frontend não iniciou, exibe erro
if [ "$FRONTEND_STARTED" = false ]; then
    echo ""
    print_error "Frontend não iniciou na porta $FRONTEND_PORT!"
    echo ""
    print_info "Log do frontend:"
    tail -n 30 frontend.log
    cleanup
    exit 1
fi

echo ""

# ======================== SUCESSO! ========================

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
print_success "APLICAÇÕES INICIADAS COM SUCESSO!"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

print_info "URLs:"
echo "   🔹 Backend:  http://localhost:$BACKEND_PORT"
echo "   🔹 Frontend: http://localhost:$FRONTEND_PORT"
echo ""

print_info "Logs em tempo real:"
echo "   🔹 Backend:  tail -f backend.log"
echo "   🔹 Frontend: tail -f frontend.log"
echo ""

print_info "Credenciais padrão:"
echo "   🔹 Email: admin@gwchallenge.com"
echo "   🔹 Senha: admin123"
echo ""

print_warning "Pressione Ctrl+C para encerrar todas as aplicações"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Aguarda indefinidamente (até Ctrl+C)
wait
