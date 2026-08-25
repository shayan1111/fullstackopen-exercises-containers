FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV VITE_BACKEND_URL=http://localhost:3000

EXPOSE 5173

CMD ["npm", "run", "dev"]