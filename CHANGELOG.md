0.10.0 / TBC
==================
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
