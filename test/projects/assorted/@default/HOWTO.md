# How to Setup Project

The setup assumes:

- Four AWS environments `local`, `dev`, `stage` and `prod`
- [Aws Profiles](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) `local`, `dev`, `stage`, `prod` for the corresponding environments with the appropriate permissions
- CircleCI Setup for the Organization containing the newly create repo
- A Bot user with write access to the repository
- [Docker](https://www.docker.com/) installed

## Important

Only enable CloudTrail if it is not already enabled for your account. Otherwise significant AWS charges will occur. 

## 0. Preparation

- Install [gally](https://www.npmjs.com/package/gally)
- Sync github settings with `ga sync`. This will create three branches `dev`, `stage` and `prod` in the upstream repo
- Sync environment variables to AWS (adjust and fill in as necessary):

```shell script
aws --region awsRegion --profile local ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_REPORT_LEVEL", "Value": "INFO"}'
aws --region awsRegion --profile dev ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_REPORT_LEVEL", "Value": "INFO"}'
aws --region awsRegion --profile stage ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_REPORT_LEVEL", "Value": "WARNING"}'
aws --region awsRegion --profile prod ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_REPORT_LEVEL", "Value": "WARNING"}'

aws --region awsRegion --profile local ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_ACCESS_TOKEN", "Value": "FILL_IN_ACCESS_TOKEN"}'
aws --region awsRegion --profile dev ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_ACCESS_TOKEN", "Value": "FILL_IN_ACCESS_TOKEN"}'
aws --region awsRegion --profile stage ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_ACCESS_TOKEN", "Value": "FILL_IN_ACCESS_TOKEN"}'
aws --region awsRegion --profile prod ssm put-parameter --cli-input-json '{"Type": "String", "Name": "ROLLBAR_ACCESS_TOKEN", "Value": "FILL_IN_ACCESS_TOKEN"}'
```

- Define other environment variables as necessary, e.g. `LOGGLY_TOKEN`, `LOGZ_TOKEN`, `DATADOG_API_KEY` (all optional)

## 1. Deploy Data Stacks

- Start docker container with `. manage.sh`

```shell script
sls deploy --config serverless/config.js --region awsRegion --env local --stack data --aws-profile local --force && \
sls deploy --config serverless/config.js --region awsRegion --env dev --stack data --aws-profile dev --force && \
sls deploy --config serverless/config.js --region awsRegion --env stage --stack data --aws-profile stage --force && \
sls deploy --config serverless/config.js --region awsRegion --env prod --stack data --aws-profile prod --force
```

## 2. Configure CircleCI

- Create the CircleCI contexts `PROJECT_NAME-local`, `PROJECT_NAME-dev`, `PROJECT_NAME-stage` and `PROJECT_NAME-prod` and
- Fill in the variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` for each context by accessing them with

```shell script
aws cloudformation describe-stacks --region awsRegion --profile ENVIRONMENT \
--stack-name PROJECT_NAME-data-ENVIRONMENT \
--query '[Stacks[*].Outputs[?OutputKey==`DeployAccessKeyId`].OutputValue, Stacks[*].Outputs[?OutputKey==`DeploySecretAccessKey`].OutputValue]' --output text
```

- Enable Project in CircleCI
- Fill in Bot user access token into CircleCI variable "GH_TOKEN"

## 3. Deploy Api Stacks

- Create pull request into `dev` branch and merge
- Pull requests from `dev` into `stage` should be created automatically
- Merge once deploy to `local` and `dev` has completed (required status checks)
- Do the same for `prod`

## 4. Post Deploy

- To correctly create logging messages please use [lambda-monitor-logger](https://github.com/blackflux/lambda-monitor-logger)
- Alternatively use `console.log()` and prefix with log level as e.g. `LEVEL: Message here`. Options for level are `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
- Not prefixed logs will be recorded as errors
