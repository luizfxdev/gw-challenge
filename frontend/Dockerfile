# ======================== DOCKERFILE - FRONTEND NEXT.JS ========================
# Imagem base: Node.js 18 Alpine (leve e rápida)
FROM node:18-alpine

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Expor porta 3000
EXPOSE 3000

# Comando para executar a aplicação em produção
CMD ["npm", "start"]
