# Lambda Monitoring

[![Build Status](https://img.shields.io/travis/simlu/lambda-monitor/master.svg)](https://travis-ci.org/simlu/lambda-monitor)
[![Test Coverage](https://img.shields.io/coveralls/simlu/lambda-monitor/master.svg)](https://coveralls.io/github/simlu/lambda-monitor?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/simlu/lambda-monitor.svg)](https://greenkeeper.io/)
[![Dependencies](https://david-dm.org/simlu/lambda-monitor/status.svg)](https://david-dm.org/simlu/lambda-monitor)
[![NPM](https://img.shields.io/npm/v/lambda-monitor.svg)](https://www.npmjs.com/package/lambda-monitor)
[![Downloads](https://img.shields.io/npm/dt/lambda-monitor.svg)](https://www.npmjs.com/package/lambda-monitor)
[![Semantic-Release](https://github.com/simlu/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/js-gardener)
[![Gitter](https://github.com/simlu/js-gardener/blob/master/assets/icons/gitter.svg)](https://gitter.im/simlu/lambda-monitor)

Automatically configure lambda log analysis and popagation to external services.

## What it does

- Pipe AWS Lambda Logs to external logging services (e.g. [Loggly](https://loggly.com) or [Logz](https://logz.io))
- Log AWS Lambda anomalies to external monitoring service (e.g. [Rollbar](https://rollbar.com))
- Fully transparent, no changes to existing Lambda functions required

![Cloudwatch To Loggly](/docs/assets/cloudwatch_to_loggly.png)


## Getting Started

...

## Contributing / What is next?


- **Publish on AWS** - [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/) has been announced to better discover, deploy, and publish serverless applications. However this requires the "wiring" logic to be written in [SAM](https://github.com/awslabs/serverless-application-model) opposed to [Serverless](https://github.com/serverless/serverless). 
- **Transparent and Configurable Pipelines** - Currently all logs are processed and handled. What gets processed and submitted where should be more transparent and configurable.
- **More Services** - There are various logging and reporting services out there and adding support for more is always desired.
- **Instant Subscriptions** - Currently subscriptions are updated periodically. Ideally these would be triggered automatically when new lambda functions are deployed. There exists an [example](https://github.com/theburningmonk/lambda-logging-demo/blob/master/serverless.yml), however I was not able to get it work as intended.
