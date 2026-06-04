FROM node:20-alpine

LABEL maintainer="Vitor Lima"
LABEL description="PIX API - DevSecOps CESAR School Lab"

WORKDIR /app

# Copiar apenas package files primeiro (cache de camadas)
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código-fonte
COPY src/ ./src/

# Criar usuário não-root para execução segura
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
