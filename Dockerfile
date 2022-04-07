FROM node:16.14.2-alpine AS builder
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
WORKDIR /app
COPY . /app
RUN npm install && npm install -g serve
CMD ["/bin/sh", "start.sh"]

# RUN npm install && npm run build:dev

# FROM node:16.14.2-alpine
# WORKDIR /app
# COPY --from=builder /app/dist ./build
# COPY serveStatic.js .
# COPY entrypoint.sh .
# RUN npm install express
# ENTRYPOINT [ "/app/entrypoint.sh" ]
# CMD ["node","./serveStatic.js"]


