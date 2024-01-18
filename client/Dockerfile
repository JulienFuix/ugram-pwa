FROM node:18-alpine as ugram_laval

WORKDIR /app
EXPOSE ${WEB_PORT}
COPY package.json package.json

# Docker Dev
FROM ugram_laval as dev

RUN corepack enable
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]


# Docker Prod
FROM ugram_laval as production

RUN npm i --force
# RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .

RUN npx next build

CMD ["npm", "run", "start"]