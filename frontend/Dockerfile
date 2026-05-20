# Stage 1: instalar dependências
FROM node:20-alpine AS deps
WORKDIR /app

# Copia os manifests do workspace
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/

# Instala todas as dependências do workspace
RUN npm ci

# Stage 2: build
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./frontend/

# Variável injetada em tempo de build (obrigatório para NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app/frontend
RUN npm run build

# Stage 3: produção (imagem mínima com standalone output)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# standalone output já inclui tudo que é necessário
COPY --from=build /app/frontend/.next/standalone ./
COPY --from=build /app/frontend/.next/static ./frontend/.next/static
COPY --from=build /app/frontend/public ./frontend/public

EXPOSE 3000
CMD ["node", "frontend/server.js"]
