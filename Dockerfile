# Multi-stage build for the Angular 16 portal, served by nginx.
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Angular 16 `ng build` defaults to the production configuration.
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/insurance-web-portal /usr/share/nginx/html
EXPOSE 80
