FROM node:13.12.0-alpine
WORKDIR /usr/src/app
RUN apk update && apk add zip
COPY app/package.json .
COPY app/yarn.lock .
COPY app/node_modules ./node_modules
RUN yarn
COPY app/src ./src
COPY app/public ./public
ENTRYPOINT [ "yarn", "start" ]
