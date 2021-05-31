# Common build stage
ARG base=node:14.17.0-buster-slim

FROM $base AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build
EXPOSE 3000

FROM build AS auth-server
CMD ["node", "/app/dist/auth.server.js"]

FROM build AS game-server
CMD ["node", "/app/dist/game.server.js"]

FROM build AS play-server
CMD ["node", "/app/dist/play.server.js"]

FROM build AS server
CMD ["node", "/app/dist/server.js"]
