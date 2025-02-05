# Etapa de construcción
FROM node:18 as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

ARG API_URL
ENV API_URL=$API_URL

# Ejecutar script de environments y construir la aplicación
RUN npm run envs && npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=builder /app/dist/sw-cotizador-frontend /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
