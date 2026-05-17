# ── Stage 1: build ──────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_STRAPI_URL=http://localhost:1337
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL

COPY package*.json ./
RUN npm install --no-audit --no-fund --prefer-offline

COPY . .
RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN printf 'server {\n    listen 80;\n    root /usr/share/nginx/html;\n    index index.html;\n    location / { try_files $uri $uri/ /index.html; }\n    gzip on;\n    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
