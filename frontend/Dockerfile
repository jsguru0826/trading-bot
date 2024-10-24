# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Check if build directory exists
RUN ls -l /app/build

# Nginx to serve the build files
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN ls -l /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]