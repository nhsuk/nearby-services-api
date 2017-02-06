# Nearby services API

[![Build Status](https://travis-ci.org/nhsuk/nearby-services-api.svg?branch=master)](https://travis-ci.org/nhsuk/nearby-services-api)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/nearby-services-api/badge.svg)](https://coveralls.io/github/nhsuk/nearby-services-api)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/nearby-services-api/badge.svg)](https://snyk.io/test/github/nhsuk/nearby-services-api)

An api focusing on services near to a specific search point.

The only consumer of this API is [connecting-to-services](https://github.com/nhsuk/connecting-to-services)
The application uses port 3000 as a default. In order to have this api work by
default alongside the app the default port it uses is 3001.

This app uses [nhsuk/bunyan-logger](https://github.com/nhsuk/bunyan-logger). As
such, a number of environment variables can be used, and in production, NEED to
be set for the logging to work. Check out the README in that repo for additional
information.

## Database

This app sources its' data from a documentDB instance. Although there are
defaults for the database, collection and endpoint there is no default for the
primary key this is in order to protect its' integrity and prevent any abuse.
However, this does mean that all environments where this app runs will need
to provide the primary key as an environment variable. Details of the name
and where to source the key from are detailed below.

## Populating the database with a sample db

<<<<<<< HEAD
This application uses a mongodb docker image with sample data. The docker compose file
is at [https://github.com/nhsuk/nhsuk-rancher-templates](https://github.com/nhsuk/nhsuk-rancher-templates)


## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

For any env var that is required by the application to run and doesn't have a
default [require-environment-variables](https://www.npmjs.com/package/require-environment-variables)
is used to throw an error and prevent the application from starting up. Rather
than it getting to point somewhere later in the lifecycle where it can't do
something because there is no value for an env var it was relying on.

| Variable              | Description                                                                            | Default                  | Required        |
|:----------------------|:---------------------------------------------------------------------------------------|:-------------------------|:----------------|
| `NODE_ENV`            | node environment                                                                       | development              |                 |
| `PORT`                | server port                                                                            | 3001                     |                 |
| `SPLUNK_HEC_TOKEN`    | [HTTP Event Collector token](http://dev.splunk.com/view/event-collector/SP-CAAAE7C)    |                          | In `production` |
| `SPLUNK_HEC_ENDPOINT` | [HTTP Event Collector endpoint](http://dev.splunk.com/view/event-collector/SP-CAAAE7H) |                          | In `production` |
| `LOG_LEVEL`           | [bunyan log level](https://github.com/trentm/node-bunyan#levels)                       | Depends on `NODE_ENV`    |                 |
| `MONGO_DB`              | Name of the database in Mongo                                                        | services                 |                 |
| `MONGODB_COLLECTION`    | Name of collection in Mongo                                                          | services                 |                 |
| `MONGODB_HOST`          | Name of MongoDB host                                                                 | mongo                    |                 |
| `MONGODB_PORT`          | The port used by MongoDB                                                             | 27017                    |                 |

## Running the application

From the docker compose file directory do
<pre><code> docker-compose up --build --force-recreate </code></pre>

Go [here](http://localhost:3001/nearby?longitude=-1.0751380920410156&latitude=50.82191467285156) for sample use.

## Contributing to the application

Make your changes but before you commit them you need to have couple of things set up.
You need to authorize/have an account with [snyk](https://snyk.io/). We use [husky](https://github.com/typicode/husky)
to run tests in git hooks so we are sure that we maintain a high standard.
 
