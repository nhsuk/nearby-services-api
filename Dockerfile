FROM node:7.4-alpine

RUN apk add --no-cache git

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /code

COPY npm-shrinkwrap.json /code

RUN npm install --quiet

EXPOSE 3001

COPY . /code

CMD [ "npm", "start" ]
