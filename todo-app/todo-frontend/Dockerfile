# Test
FROM node:24 as test-stage

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

COPY . .

ENV VITE_BACKEND_URL=/api

RUN npm run test

# Build
FROM test-stage as build-stage   

RUN npm run build

# Production stage
FROM nginx:1.29-alpine as run-stage

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80