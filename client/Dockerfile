FROM node:18-alpine as ugram_laval
WORKDIR /app
EXPOSE ${WEB_PORT}
COPY . .
RUN npm i

# Docker Dev
FROM ugram_laval as dev
COPY . .
CMD ["npm", "run", "dev"]


# Docker Prod
FROM ugram_laval as builder
RUN npx next build

FROM builder as production
COPY --from=builder /app/.next ./.next
CMD ["npm", "run", "start"]