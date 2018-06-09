FROM node:8.11.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

COPY ./src ./src
COPY ./public ./public

RUN npm i
RUN npm cache clean --force --loglevel error

CMD yarn start