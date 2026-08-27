FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV REDIS_URL=redis://localhost:6379
ENV MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database

CMD ["npm", "run", "dev"]