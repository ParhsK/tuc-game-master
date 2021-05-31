FROM node:14.17.0-buster-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build:prod

FROM nginx:1.20.1-alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/tgm-web/ /usr/share/nginx/html/
