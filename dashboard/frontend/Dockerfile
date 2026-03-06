# Build step
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve step
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (default nginx is 80)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
