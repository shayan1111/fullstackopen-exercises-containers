FROM node:24 AS build-stage

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.29

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80