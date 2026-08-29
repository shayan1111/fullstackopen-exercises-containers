FROM node:24

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]

EXPOSE 3003