# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve the static files with nginx
FROM nginx:alpine
COPY --from=build /app/build /var/www/trading-bot/frontend/build

CMD ["nginx", "-g", "daemon off;"]
