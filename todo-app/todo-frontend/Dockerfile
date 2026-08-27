# Test
FROM node:24 as test-stage

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

COPY . .

ENV VITE_BACKEND_URL=http://localhost:3000

RUN npm run test

# Build
FROM test-stage as build-stage   

RUN npm run build

# Run
FROM build-stage as run-stage

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]