FROM node:7.4-alpine
RUN apk add --no-cache git

WORKDIR /code

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

ENV DATETIME="${DATETIME}"

COPY npm-shrinkwrap.json /code

RUN if [ "$NODE_ENV" == "production" ]; then npm install --quiet --only=prod; else npm install --quiet ; fi

EXPOSE 3000

COPY . /code

CMD [ "npm", "start" ]
