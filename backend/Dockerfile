FROM node:20-alpine
WORKDIR /app

# Native build tools needed for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1337

# 'develop' builds the admin panel on first start and watches for changes.
# Switch to 'start' in production after running 'npm run build' separately.
CMD ["npm", "run", "develop"]
