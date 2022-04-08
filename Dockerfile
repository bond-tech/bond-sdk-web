FROM node:16.14.2-alpine
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
WORKDIR /app
COPY . /app
RUN npm install && npm install -g serve express
CMD ["/bin/sh", "start.client.sh"]
