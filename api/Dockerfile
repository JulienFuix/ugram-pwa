# FROM node:16-alpine

# WORKDIR /api

# COPY package*.json ./

# RUN yarn install

# COPY . .

# CMD yarn dev

FROM node:18-alpine as ugram_laval_server

WORKDIR /app
EXPOSE 3030
COPY package.json package.json
# activate yarn
RUN corepack enable


# dockerfile for development
FROM ugram_laval_server as dev

RUN npm install
COPY . .

CMD npm run dev


# dockerfile for production
FROM ugram_laval_server as production

RUN yarn install
COPY . .

CMD yarn run dev
