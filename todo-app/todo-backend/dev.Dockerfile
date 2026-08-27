FROM node:24

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci \
    --fetch-retries=10 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 \
    --fetch-timeout=600000

COPY . .

CMD [ "npm", "run", "dev" ]