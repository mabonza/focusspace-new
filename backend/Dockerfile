FROM node:20-alpine
WORKDIR /app

# Build tools for native modules (better-sqlite3, etc.)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Build the Strapi admin panel for production
RUN NODE_ENV=production npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
