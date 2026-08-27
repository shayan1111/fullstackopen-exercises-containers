FROM node:24

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# Install project dependencies
RUN npm ci

COPY . .

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]