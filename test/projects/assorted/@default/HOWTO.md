# How to Setup Monitoring

## Deploy Data Stacks

Adjust below as necessary

```shell script
sls deploy --config serverless/config.js --region REGION --env local --stack data --aws-profile local --force && \
sls deploy --config serverless/config.js --region REGION --env dev --stack data --aws-profile dev --force && \
sls deploy --config serverless/config.js --region REGION --env stage --stack data --aws-profile stage --force && \
sls deploy --config serverless/config.js --region REGION --env prod --stack data --aws-profile prod --force
```
