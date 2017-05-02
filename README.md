# Nearby services API

[![Build Status](https://travis-ci.org/nhsuk/nearby-services-api.svg?branch=master)](https://travis-ci.org/nhsuk/nearby-services-api)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/nearby-services-api/badge.svg)](https://coveralls.io/github/nhsuk/nearby-services-api)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/nearby-services-api/badge.svg)](https://snyk.io/test/github/nhsuk/nearby-services-api)

An api focusing on services near to a specific search point.

Currently, it is used by [connecting-to-services](https://github.com/nhsuk/connecting-to-services)
to provide services near to a lat/lon.

This app uses [nhsuk/bunyan-logger](https://github.com/nhsuk/bunyan-logger). As
such, a number of environment variables can be used, and in production, NEED to
be set for the logging to work. Check out the README in that repo for additional
information.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

For any env var that is required by the application to run and doesn't have a
default [require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to throw an error and prevent the application from starting up. Rather
than it getting to point somewhere later in the lifecycle where it can't do
something because there is no value for an env var it was relying on.

| Variable              | Description                             | Default      |
|:----------------------|:----------------------------------------|:-------------|
| `NODE_ENV`            | node environment                        | development  |
| `PORT`                | server port                             | 3001         |
| `MONGO_DB`            | Name of the database in the Mongo image | services     |
| `MONGODB_COLLECTION`  | Name of collection in the Mongo image   | pharmacies   |
| `MONGODB_HOST`        | Name of MongoDB host                    | mongo        |
| `MONGODB_PORT`        | The port used by MongoDB                | 27017        |

## Running the application

Start by cloning the repo and all submodules i.e.
`git clone https://github.com/nhsuk/nearby-services-api.git && cd profiles/ && git submodule update --init --recursive`

Next, have a look at the scripts for getting the application running
[`scripts`](scripts/)

Then click [here](http://localhost:3001/nearby?longitude=-1.0751380920410156&latitude=50.82191467285156)
to see results (if all went well).

To run the full stack application including the front end use the docker-compose-full-stack.yml, i.e.
`docker-compose -f docker-compose-full-stack.yml down -v`
`docker-compose -f docker-compose-full-stack.yml up --build --force-recreate`

### Changing the time

This stack supports an environment variable to change the current time in the API.
Sample format to set:
`export DATETIME=2017-02-15T03:30:00`
And to remove:
`unset DATETIME`

## Running the tests

Before running the tests (via the test script) for the first time you need to
have a Snyk auth token as `SNYK_TOKEN=`, either created in an `.env` file or
added to the `docker-compose-test.yml`
*NB* Your secrets should not be checked into the repo.

## FAQ

1. When I run `docker-compose` I get errors about packages missing. Often it seems to be Nodemon.
  * This could well be because the volume used by the service has previously
    been mounted when `NODE_ENV` was set to `production`. Try running
    `docker-compose down -v` which removes all the things created by the
    `docker-compose up` command, including volumes (with the `-v` flag). For
    test, run `docker-compose -f docker-compose-tests.yml down -v`


## Contributing to the application

Make your changes but before you commit them you need to have couple of things
set up.  You need to authorize/have an account with [snyk](https://snyk.io/).
We use [husky](https://github.com/typicode/husky) to run tests in git hooks so
we are sure that we maintain a high standard, so please run the tests alongside
your application.
