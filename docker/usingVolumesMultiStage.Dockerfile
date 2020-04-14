FROM node:13.12.0-alpine as builder
WORKDIR /usr/src/app
COPY app/package.json .
COPY app/yarn.lock .
COPY app/node_modules ./node_modules
RUN yarn

FROM node:13.12.0-alpine as dev
WORKDIR /usr/src/app
RUN apk update && apk add zip
# Copy generated assets from the builder stage
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/yarn.lock .
COPY --from=builder /usr/src/app/node_modules ./node_modules
# These will be used as volumes when invoked with docker-compose
COPY app/public ./public
COPY app/src ./src
ENTRYPOINT ["yarn", "start" ]
