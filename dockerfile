# front_adso-main/Dockerfile

# ---- Etapa 1: Construcción de la aplicación React ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:8080/api/v1/aprendiz
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Etapa 2: Servir los archivos estáticos con Nginx ----
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80