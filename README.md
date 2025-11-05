# 📦 GW Challenge - Sistema de Rastreamento de Encomendas

<div align="center">

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-2.7.18-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-12-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Sistema completo de rastreamento de encomendas com arquitetura escalável e moderna**

[📖 Documentação](#-documentação-detalhada) •
[🚀 Quick Start](#-quick-start) •
[🐳 Docker](#-docker) •
[📥 Downloads](#-downloads)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Documentação Detalhada](#-documentação-detalhada)
- [Stack Tecnológico](#-stack-tecnológico)
- [Quick Start](#-quick-start)
- [Docker](#-docker)
- [Downloads](#-downloads)
- [Planejamento e Etapas](#-planejamento-e-etapas)
- [Melhorias Implementadas](#-melhorias-implementadas)
- [Scripts de Inicialização](#-scripts-de-inicialização)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O **GW Challenge** é um sistema completo de rastreamento de encomendas desenvolvido como parte de um desafio técnico. O projeto demonstra boas práticas de desenvolvimento, arquitetura limpa e tecnologias modernas.

### ✨ Funcionalidades Principais

✅ **Gestão de Pacotes** - Criar, consultar e gerenciar pacotes com código de rastreio único  
✅ **Rastreamento em Tempo Real** - Registrar eventos de movimentação com timestamps precisos  
✅ **Consulta por Código** - Buscar pacotes e visualizar histórico completo de eventos  
✅ **API REST Completa** - Endpoints documentados e padronizados  
✅ **Validações Robustas** - Regras de negócio implementadas em todas as camadas  
✅ **Interface Responsiva** - Design adaptável para desktop, tablet e mobile  
✅ **Containerização** - Deploy simplificado com Docker Compose  

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│         React 18 + TypeScript + Tailwind CSS            │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST (Port 3000)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Spring Boot)                   │
│       Java 17 + Spring Data JPA + Maven                 │
└──────────────────────┬──────────────────────────────────┘
                       │ JDBC (Port 8080)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                DATABASE (PostgreSQL)                    │
│      Tables: package, event, user (Port 5432)          │
└─────────────────────────────────────────────────────────┘
```

### 📐 Padrão de Camadas

**Backend (Spring Boot):**
```
Controller → Service → Repository → Entity → Database
    ↓         ↓          ↓            ↓
  DTOs    Lógica de   JPA/SQL    Entidades
         Negócio                    JPA
```

**Frontend (Next.js):**
```
Pages → Components → Services → API (Backend)
  ↓         ↓           ↓
 UI     Reutilizáveis  Axios
```

---

## 📚 Documentação Detalhada

A documentação completa do projeto está dividida em módulos especializados:

### 🔧 [BACKEND.md](./backend/BACKEND.md)
- Arquitetura e estrutura do projeto Spring Boot
- Entidades JPA e relacionamentos (Package ↔ Event)
- Controllers REST e endpoints disponíveis
- Services com lógica de negócio
- DTOs para evitar referências circulares
- Validações implementadas
- **Desafio resolvido: StackOverflowError** em serialização JSON
- Exemplos de requisições e respostas da API

### 🗄️ [DATABASE.md](./database/DATABASE.md)
- Schema completo das tabelas (DDL)
- Relacionamentos e constraints (Foreign Keys)
- Índices para otimização de performance
- Dados de teste (seed data)
- Queries SQL de exemplo
- Estratégias de backup e restore
- **Desafio resolvido:** Referências circulares no JPA

### 🎨 [FRONTEND.md](./frontend/FRONTEND.md)
- Estrutura de páginas e componentes React
- Rotas do Next.js (/, /login, /create-package, /register-event)
- Integração com API usando Axios
- Validação de formulários com React Hook Form
- Styling com Tailwind CSS
- Gerenciamento de estado
- **Desafio resolvido:** Sincronização de dados em tempo real

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Java | 17 | Linguagem principal |
| Spring Boot | 2.7.18 | Framework web |
| Spring Data JPA | 2.7.18 | ORM e persistência |
| PostgreSQL | 14 | Banco de dados relacional |
| Maven | 3.8.1 | Gerenciador de dependências |
| Hibernate | 5.6.x | Implementação JPA |

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Next.js | 12 | Framework React |
| React | 18 | Biblioteca UI |
| TypeScript | 5.0 | Tipagem estática |
| Tailwind CSS | 3.0 | Framework CSS |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Axios | 1.x | Cliente HTTP |

### DevOps
| Tecnologia | Descrição |
|------------|-----------|
| Docker | Containerização |
| Docker Compose | Orquestração de containers |
| Git | Controle de versão |
| PostgreSQL (Container) | Banco de dados containerizado |

---

## 🚀 Quick Start

### Pré-requisitos

```bash
# Versões necessárias:
- Node.js 16+
- Java 17+
- PostgreSQL 14+
- Docker & Docker Compose (opcional)
- Maven 3.8+
```

### 📥 Instalação Local (Sem Docker)

#### 1. Backend

```bash
# Navegar para o diretório do backend
cd backend

# Compilar o projeto
mvn clean compile

# Executar a aplicação
mvn spring-boot:run
```

✅ Backend estará rodando em: **http://localhost:8080**

#### 2. Database

```bash
# Criar banco de dados PostgreSQL
createdb gwchallenge

# Executar script SQL fornecido
psql -U postgres -d gwchallenge -f database/gw-challenge-ddl.sql
```

✅ Banco de dados estará disponível em: **localhost:5432**

#### 3. Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

✅ Frontend estará rodando em: **http://localhost:3000**

---

## 🐳 Docker

### Usando Docker Compose (Recomendado)

O projeto inclui configuração completa do Docker Compose para subir todos os serviços de uma vez.

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso iniciará:

✅ **PostgreSQL** na porta `5432`  
✅ **Backend (Spring Boot)** na porta `8080`  
✅ **Frontend (Next.js)** na porta `3000`  

### Comandos Docker Úteis

```bash
# Parar todos os containers
docker-compose down

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Ver logs do banco de dados
docker-compose logs -f postgres

# Reiniciar apenas o backend
docker-compose restart backend

# Limpar volumes (reset completo)
docker-compose down -v
```

### Arquivo docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: gw-postgres
    environment:
      POSTGRES_DB: gwchallenge
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/gw-challenge-ddl.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build: ./backend
    container_name: gw-backend
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/gwchallenge
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    ports:
      - "8080:8080"

  frontend:
    build: ./frontend
    container_name: gw-frontend
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080/api
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

---

## 📥 Downloads

### Artefatos do Projeto

| Artefato | Tamanho | Descrição | Link |
|----------|---------|-----------|------|
| **gw-challenge-backend.jar** | ~38 MB | Aplicação Spring Boot compilada | [📦 Download](https://drive.google.com/file/d/1a7NzD2VPnlBWmanT0_DlGOMq_xaFhJZC/view?usp=sharing) |
| **gw-challenge-ddl.sql** | ~5 KB | Script SQL do banco de dados | [📄 Download](https://drive.google.com/file/d/1R3y9MWrj55kJIq4ttmAD0PRbn-Y3htj6/view?usp=sharing) |

### Como Usar os Downloads

#### Executar o .jar

```bash
# Executar aplicação Spring Boot
java -jar gw-challenge-backend.jar

# Com profile específico
java -jar -Dspring.profiles.active=dev gw-challenge-backend.jar
```

#### Executar o script SQL

```bash
# Criar banco e executar script
psql -U postgres -d gwchallenge -f gw-challenge-ddl.sql

# Ou conectar e executar manualmente
psql -U postgres -d gwchallenge
\i gw-challenge-ddl.sql
```

---

## 📊 Planejamento e Etapas

### Fase 1: Planejamento e Design ✅

- [x] Definição de requisitos funcionais e não-funcionais
- [x] Design da arquitetura (Frontend, Backend, Database)
- [x] Modelagem do banco de dados (Diagrama ER)
- [x] Prototipagem de UI/UX
- [x] Escolha das tecnologias

### Fase 2: Backend (Spring Boot) ✅

- [x] Setup do projeto Spring Boot com Maven
- [x] Criação das entidades JPA (Package, Event, EventStatus)
- [x] Implementação dos repositories (Spring Data JPA)
- [x] Desenvolvimento dos controllers REST
- [x] Criação de DTOs para evitar serialização circular
- [x] Implementação de services com lógica de negócio
- [x] Validações de entrada (@Valid, Bean Validation)
- [x] Tratamento global de exceções
- [x] Configuração de CORS

### Fase 3: Database (PostgreSQL) ✅

- [x] Criação do schema (package, event, user)
- [x] Definição de relacionamentos (1:N com CASCADE)
- [x] Criação de índices para performance
- [x] Inserção de dados de teste (seed data)
- [x] Documentação de queries úteis

### Fase 4: Frontend (Next.js) ✅

- [x] Setup do projeto Next.js com TypeScript
- [x] Configuração do Tailwind CSS
- [x] Criação de páginas (/login, /, /create-package, /register-event)
- [x] Componentes reutilizáveis (EventForm, Timeline, Header)
- [x] Integração com API usando Axios
- [x] Validação de formulários (React Hook Form)
- [x] Responsividade mobile-first
- [x] Gerenciamento de autenticação (localStorage)

### Fase 5: DevOps e Deploy ✅

- [x] Configuração do Docker (Dockerfile para backend e frontend)
- [x] Criação do docker-compose.yml
- [x] Scripts de inicialização (./start.sh)
- [x] Build do JAR executável
- [x] Geração do script SQL completo
- [x] Upload de artefatos (Google Drive)
- [x] Documentação completa (4 READMEs)

### Fase 6: Testes e Refinamento ✅

- [x] Testes de integração Backend ↔ Database
- [x] Testes de integração Frontend ↔ Backend
- [x] Correção de bugs (StackOverflowError resolvido)
- [x] Otimização de queries SQL
- [x] Validação de fluxos completos
- [x] Refinamento de UX/UI

---

## 🔧 Melhorias Implementadas

### 🐛 Problemas Resolvidos

#### 1. StackOverflowError na Serialização JSON

**Problema:**
```java
// Referência circular infinita:
Package → events (List<Event>) → packageEntity (Package) → events → ...
```

**Solução Implementada:**
- Criação de DTOs (`EventResponseDTO`, `PackageResponseDTO`)
- Remoção do Lombok (conflitos com JPA)
- Implementação manual de getters/setters
- Uso de `@JsonBackReference` e `@JsonManagedReference`
- Service layer para conversão Entity → DTO

**Resultado:** ✅ Serialização sem loops infinitos

#### 2. Problema com Lombok e Compilação

**Problema:**
```bash
[ERROR] cannot find symbol: method getId()
[ERROR] cannot find symbol: method getTrackingCode()
```

**Solução:**
- Substituição de `@Data` por `@Getter` + `@Setter` explícitos
- Criação de DTOs sem Lombok
- Implementação manual de `toString()` sem campos bidirecionais

**Resultado:** ✅ Compilação bem-sucedida

#### 3. N+1 Queries no JPA

**Problema:**
```java
// 1 query para buscar packages + N queries para cada evento
List<Package> packages = packageRepository.findAll();
for (Package p : packages) {
    p.getEvents(); // Query adicional
}
```

**Solução:**
```java
@Query("SELECT DISTINCT p FROM Package p LEFT JOIN FETCH p.events")
List<Package> findAllWithEvents();
```

**Resultado:** ✅ 1 query com JOIN ao invés de N+1

#### 4. FetchType EAGER vs LAZY

**Antes:**
```java
@OneToMany(fetch = FetchType.EAGER) // Carrega tudo sempre
private List<Event> events;
```

**Depois:**
```java
@OneToMany(fetch = FetchType.LAZY) // Carrega apenas quando necessário
private List<Event> events;
```

**Resultado:** ✅ Performance melhorada

---

## 🚀 Scripts de Inicialização

### Linux/Mac: `start.sh`

```bash
#!/bin/bash

echo "🚀 Iniciando GW Challenge..."

# Parar containers antigos
docker-compose down

# Construir e iniciar containers
docker-compose up -d

echo "✅ Backend: http://localhost:8080"
echo "✅ Frontend: http://localhost:3000"
echo "✅ Database: localhost:5432"

# Aguardar inicialização
sleep 5

# Abrir no navegador
open http://localhost:3000 || xdg-open http://localhost:3000
```

**Uso:**
```bash
chmod +x start.sh
./start.sh
```

### Windows: `start.ps1`

```powershell
# start.ps1
Write-Host "🚀 Iniciando GW Challenge..."

docker-compose down
docker-compose up -d

Write-Host "✅ Backend: http://localhost:8080"
Write-Host "✅ Frontend: http://localhost:3000"
Write-Host "✅ Database: localhost:5432"

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
```

**Uso:**
```powershell
.\start.ps1
```

---

## 🔐 Variáveis de Ambiente

### Backend: `application-dev.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/gwchallenge
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080

# Logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Frontend: `.env.local`

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Environment
NODE_ENV=development
```

---

## 📁 Estrutura do Projeto

```
GW-CHALLENGE/
│
├── backend/                          # API Java + Spring Boot
│   ├── src/main/java/com/gwchallenge/
│   │   ├── controller/              # Controllers REST
│   │   │   ├── EventController.java
│   │   │   └── PackageController.java
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── CreateEventDTO.java
│   │   │   ├── CreatePackageDTO.java
│   │   │   ├── EventResponseDTO.java
│   │   │   └── PackageResponseDTO.java
│   │   ├── model/                   # Entidades JPA
│   │   │   ├── Event.java
│   │   │   ├── EventStatus.java
│   │   │   └── Package.java
│   │   ├── repository/              # Repositories JPA
│   │   │   ├── EventRepository.java
│   │   │   └── PackageRepository.java
│   │   ├── service/                 # Lógica de negócio
│   │   │   ├── EventService.java
│   │   │   └── PackageService.java
│   │   ├── exception/               # Exceções customizadas
│   │   │   └── ResourceNotFoundException.java
│   │   └── GwChallengeApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application-dev.properties
│   ├── pom.xml
│   ├── Dockerfile
│   └── BACKEND.md                   # 📖 Documentação do backend
│
├── database/                         # Scripts de banco de dados
│   ├── gw-challenge-ddl.sql         # Script completo
│   └── DATABASE.md                  # 📖 Documentação do database
│
├── frontend/                         # Aplicação Next.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventForm.tsx
│   │   │   └── Timeline.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx            # Página de rastreamento
│   │   │   ├── login.tsx            # Página de login
│   │   │   ├── create-package.tsx   # Criar pacote
│   │   │   └── register-event.tsx   # Registrar evento
│   │   ├── services/
│   │   │   └── api.ts               # Cliente HTTP
│   │   ├── types/
│   │   │   └── models.ts            # Tipos TypeScript
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── FRONTEND.md                  # 📖 Documentação do frontend
│
├── docker-compose.yml               # Orquestração Docker
├── start.sh                         # Script de inicialização (Linux/Mac)
├── start.ps1                        # Script de inicialização (Windows)
├── .gitignore
└── README.md                        # 📖 Este arquivo
```

---

## 👨‍💻 Autor

**Luiz Felipe de Oliveira**

[![GitHub](https://img.shields.io/badge/GitHub-luizfxdev-181717?style=for-the-badge&logo=github)](https://github.com/luizfxdev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-luizfxdev-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/luizfxdev)
[![Portfolio](https://img.shields.io/badge/Portfolio-luizfxdev.com.br-FF6B6B?style=for-the-badge&logo=google-chrome&logoColor=white)](https://luizfxdev.com.br)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte de um desafio técnico.

**Licença:** MIT

---

## ✨ Agradecimentos

Agradeço à equipe da **GW Sistemas** pela oportunidade de desenvolver este desafio técnico completo e demonstrar minhas habilidades em desenvolvimento full-stack.

---

<div align="center">

**Desenvolvido com ❤️ por Luiz Felipe de Oliveira**

**Versão:** 1.0.0  
**Última atualização:** 05 de Novembro de 2025

</div>