# Nearby services API

[![Build Status](https://travis-ci.org/nhsuk/nearby-services-api.svg?branch=master)](https://travis-ci.org/nhsuk/nearby-services-api)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/nearby-services-api/badge.svg)](https://coveralls.io/github/nhsuk/nearby-services-api)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/nearby-services-api/badge.svg)](https://snyk.io/test/github/nhsuk/nearby-services-api)

An api focusing on services near to a specific search point.

The only consumer of this API is [connecting-to-services](https://github.com/nhsuk/connecting-to-services)
The application uses port 3000 as a default. In order to have this api work by
default alongside the app the default port it uses is 3001.

This app uses [nhsuk/bunyan-logger](https://github.com/nhsuk/bunyan-logger). As
such a number of environment variables can be used, and in production, NEED to
be set for the logging to work. Check out the README in that repo for additional
information.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

| Variable                         | Description                                                                            | Default                  | Required        |
|:---------------------------------|:---------------------------------------------------------------------------------------|:-------------------------|-----------------|
| `NODE_ENV`                       | node environment                                                                       | development              |                 |
| `PORT`                           | server port                                                                            | 3001                     |                 |
| `PHARMACY_LIST_PATH`             | Path to json file containing list of pharmacies                                        | `../data/pharmacy-list`  |                 |
| `SPLUNK_HEC_TOKEN`               | [HTTP Event Collector token](http://dev.splunk.com/view/event-collector/SP-CAAAE7C)    |                          | In `production` |
| `SPLUNK_HEC_ENDPOINT`            | [HTTP Event Collector endpoint](http://dev.splunk.com/view/event-collector/SP-CAAAE7H) |                          | In `production` |
| `LOG_LEVEL`                      | [bunyan log level](https://github.com/trentm/node-bunyan#levels)                       | Depends on `NODE_ENV`    |                 |
