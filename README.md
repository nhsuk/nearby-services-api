# Nearby services API

[![Build Status](https://travis-ci.org/nhsuk/nearby-services-api.svg?branch=master)](https://travis-ci.org/nhsuk/nearby-services-api)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/nearby-services-api/badge.svg)](https://coveralls.io/github/nhsuk/nearby-services-api)
[![bitHound Dependencies](https://www.bithound.io/github/nhsuk/nearby-services-api/badges/dependencies.svg)](https://www.bithound.io/github/nhsuk/nearby-services-api/master/dependencies/npm)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/nearby-services-api/badge.svg)](https://snyk.io/test/github/nhsuk/nearby-services-api)

An api focusing on services near to a specific search point.

The only consumer of this API is [connecting-to-services](https://github.com/nhsuk/connecting-to-services)
The application uses port 3000 as a default. In order to have this api work by
default alongside the app the default port it uses is 3001.

This app uses [nhsuk/bunyan-logger](https://github.com/nhsuk/bunyan-logger). As
such a number of environment variables can be used, and in production, NEED to
be set for the logging to work. Check out the README in that repo for additional
information.
