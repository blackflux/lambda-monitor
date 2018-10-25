# Lambda Monitoring

[![Build Status](https://img.shields.io/travis/simlu/lambda-monitor/master.svg)](https://travis-ci.org/simlu/lambda-monitor)
[![Test Coverage](https://img.shields.io/coveralls/simlu/lambda-monitor/master.svg)](https://coveralls.io/github/simlu/lambda-monitor?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=simlu/lambda-monitor)](https://dependabot.com)
[![Dependencies](https://david-dm.org/simlu/lambda-monitor/status.svg)](https://david-dm.org/simlu/lambda-monitor)
[![NPM](https://img.shields.io/npm/v/lambda-monitor.svg)](https://www.npmjs.com/package/lambda-monitor)
[![Downloads](https://img.shields.io/npm/dt/lambda-monitor.svg)](https://www.npmjs.com/package/lambda-monitor)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

Automatically configure lambda log analysis and popagation to external services.

## What it does

- Parsing and analysis of AWS Lambda Logs
- Sets Lambda Cloudwatch log retention to 30 days to reduce storage cost
- Pipes AWS Lambda Logs to external logging services (e.g. [Loggly](https://loggly.com), [Logz](https://logz.io) or [Datadog](https://www.datadoghq.com))
- Detects and sends AWS Lambda anomalies to external monitoring service (e.g. [Rollbar](https://rollbar.com))
- Fully transparent, no changes to existing Lambda functions required

![Cloudwatch To Loggly](/docs/assets/cloudwatch_to_loggly.png)

## Requirements

- Install [Serverless Framework](https://serverless.com/) with `npm install -g serverless`.
- All functions need to be tagged correctly with `STAGE` tag to be monitored (e.g. dev, qa, prod). The Serverless Framework does this automatically.

## Getting Started

Getting set up is very easy:
1) Clone repository locally with
```bash
$ git clone https://github.com/simlu/lambda-monitor
```
2) Copy `config/example.yml` to `config/STAGE.yml` for each `STAGE` (e.g. `dev`, `qa` or `prod`).
3) Configure copied files with appropriate tokens. Unused token need to be removed.
4) Install docker and start container with `. manage.sh`
5) Run `npm ci` inside newly created `lambda-monitor` directory inside docker.
6) Build with `npm run clean-build`
7) Run `sls deploy --stage=STAGE --region=REGION --force` for each stage.

If you decide to uninstall, simply run `sls remove --stage=STAGE --region=REGION`

### Configure Rollbar (Optional)

First create a new Rollbar project and call it `lambda-monitor` or similar. Now create a server write key for each stage that you are using and put it into the corresponding `STAGE.yml` file (see above).

You can configure the minimum log level that should be send to rollbar using `ROLLBAR_LOG_LEVEL`. Available options are:
`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`

To tag log messages just prefix them with, e.g. `DEBUG:`. Default log level is `WARNING`.

If you decide not to enable rollbar logging please remove the token from the appropriate yml files.

> :link: For Rollbar Logging directly from Lambda Function see [lambda-rollbar](https://github.com/simlu/lambda-rollbar).

### Configure Log Services (All Optional)

Obtain token and fill into all or corresponding `STAGE.yml`. The current stage is submitted to the logs as `env`, so you are able to easily distinguish between your stages.

If you don't want to use a service, please remove the corresponding token from the yml file.

> :warning: It is recommended that you only enable one logging service at a time to avoid log resubmission when a service temporarily fails to accept data.

### Enable Auto Subscribe for new Lambda Function

To enable auto subscribe for new lambda functions you need to have CloudTrail enabled for your region.
You can either do this manually, or you can do it by setting `ENABLE_CLOUD_TRAIL_LOGGING` to `"true"`.

> :warning: Only enable this for one environment (probably production) and only if you have **not** enabled it manually. 
Otherwise CloudTrail will log to multiple buckets and significant charges can occur.

### Disable Logging for a Lambda Function

To exclude a lambda function from being monitored simply add the tag `"MONITORED": "0"`. Note that you need to manually unsubscribe if `process-log` has already been subscribed to the CloudWatch stream.

## How it works

While deploying this project is very straight forward, there is a lot of complexity going on behind the scenes to ensure:

- All Lambda functions are subscribed on initial deploy
- Newly created Lambda function are immediately subscribed
- Periodic checks for Lambda functions not subscribed (self healing)

There are four lambda function created per stage. All operations are only performed on lambda functions tagged with the corresponding stage.

**process-logs** - This lambda function is subscribed to CloudWatch and processes the logs. Anomalies are submitted to rollbar and all detected log events are sent to the configured logging services. Tagged with `"MONITOR": "1"` and `"MONITORED": "0"`.

**subscribe** - Subscribes the *process-logs* lambda function (detected using the `MONITOR` tag) to all relevant CloudWatch Groups, excluding those functions that have the `MONITORED` tag set to `0`. 

**set-retention** - Updates the retention for all relevant CloudWatch Groups.

**empty-bucket** - Empty and delete CloudTrail bucket when stage is removed from AWS.

## Alternative Setup (More Work)

This repo is also published on npm. You can install it with `npm install --save lambda-monitor` and then use the three exposed lambda functions to your liking (note that you will need to set the environment variables correctly).

## Contributing / What is next?

- **Publish on AWS** - [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/) has been announced to better discover, deploy, and publish serverless applications. However this requires the "wiring" logic to be written in [SAM](https://github.com/awslabs/serverless-application-model) opposed to [Serverless](https://github.com/serverless/serverless). 
- **Transparent and Configurable Pipelines** - Currently all logs are processed and handled. What gets processed and submitted where should be more transparent and configurable.
- **More Services** - There are various logging and reporting services out there and adding support for more is always desired.

> :warning: When contributing please make sure that the recorded cassettes do not expose any security relevant information. E.g. tokens need to be replaced.
