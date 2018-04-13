0.18.0 / TBD
===================
- Upgrade to `eslint-config-nhsuk@0.14.0` and apply fixes
- Downgrade Docker container to `node:8.9.4-alpine`
- Update npm dependencies
- Remove snyk

0.17.0 / 2018-03-15
===================
- Add newrelic application monitoring
- Update npm dependencies
- Upgrade Docker container to `node:8.10.0-alpine`

0.16.0 / 2018-02-08
===================
- Wrap thrown errors in `VError`
- Update npm dependencies

0.15.0 / 2018-02-06
===================
- Remove `openingTimesOverview` field from results

0.14.2 / 2018-01-25
===================
- Fix bug where closing time was wrong for service open past midnight when checking at 23:59

0.14.1 / 2018-01-23
===================
- Fix bug where opening time moment was changed to a string when spanning midnight
- Display message for orgs with no opening times and no telephone number

0.14.0 / 2018-01-18
===================
- Extend tests to cover alterations changing standard times
- Use latest data snapshot
- New end point returning only services that are open available at `/open`
- `/nearby` endpoint refactored to only return services that are nearby, regardless of open state
- Removal of distance limitation for checking results are within a certain distance of the search point
- Number of open results increased from 1 to 10
- Documented API interface in `README`
- Add `openingTimesOverview` to results containing first opening and last closing times for each day

0.13.0 / 2017-12-12
===================
- Return `nextOpen` in response
- Add test for opening beyond tomorrow

0.12.0 / 2017-11-16
===================
- Upgrade Docker container to `node:8.9.1-alpine`
- Remove redundant `--` for forwarding script options
- Round up to nearest minute in 'opening in' message
- Update npm dependencies
- Opening times message changes - opening to open and time formatting

0.11.0 / 2017-10-31
===================
- Upgrade Docker container to `node:8.8.1-alpine`
- Update npm dependencies

0.10.2 / 2017-10-17
===================
- Apply timezone when getting open messages

0.10.1 / 2017-10-10
===================
- Upgrade npm dependencies
- Use Mocha v3 behaviour to exit processes

0.10.0 / 2017-10-09
===================
- Upgrade all npm dependencies
- Add and configure security headers
- Move pharmacy open logic to an Elasticsearch query

0.9.1 / 2017-09-08
==================
- Switch to Elasticsearch back end
- Upgrade to node 8.4.0
- Added changelog
- Upgrade of packages

0.9.0 / 2017-08-27
==================
- Switch to `geoNear` query, away from using the aggregation pipeline
- Additional performance tweaks

0.8.0 / 2017-07-17
==================
- Performance improvements for searching places when there are none open. This
  is typically the case in the early hours of the morning. Between 00:00 and
  05:00 are the worst hours
- Use tcp check rather than http check to reduce resource usage for probes

0.7.1 / 2017-07-17
==================
- Logging improvements

0.7.0 / 2017-07-13
==================
- Upgrade to node `8.1.4` to address
  [security issue](https://nodejs.org/en/blog/vulnerability/july-2017-security-releases/)

0.6.0 / 2017-05-25
==================
- Automated deployment to use a single service stack
- Logging improvements
- Upgrade of packages

0.5.2 / 2017-04-10
==================
- MIT license
- `nhsuk-bunyan-logger` replaces `bunyan`

0.5.1 / 2017-03-22
==================
- Update CI Deployment submodules

0.5.0 / 2017-03-21
==================
- General upgrade of packages. No change to functionality

0.4.1 / 2017-02-22
==================
- Fixes issue with searching too far. It was going out for 500 miles and should
  have only been 20

< 0.4.1 / 2017-02-17
====================
- Initial work on the module
