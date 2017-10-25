FROM node:8.8.0-alpine
RUN apk add --no-cache git

ENV USERNAME nodeuser

RUN adduser -D $USERNAME && \
    mkdir /code && \
    chown $USERNAME:$USERNAME /code

USER $USERNAME
WORKDIR /code

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY yarn.lock package.json /code/

RUN if [ "$NODE_ENV" == "production" ]; then yarn install --pure-lockfile --production --ignore-optional; else yarn install --pure-lockfile --ignore-optional ; fi

EXPOSE 3000

COPY . /code

USER root
RUN find /code -user 0 -print0 | xargs -0 chown $USERNAME:$USERNAME
USER $USERNAME

# RUN APP DIRECTLY TO AVOID SPAWNING SUBPROCESSES IN DOCKER
CMD [ "node", "server.js" ]
