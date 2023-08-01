/* load-hot */
import AwsSdkWrap from 'aws-sdk-wrap';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import {
  SQSClient,
  SendMessageBatchCommand
} from '@aws-sdk/client-sqs';
import {
  LambdaClient,
  GetFunctionCommand
} from '@aws-sdk/client-lambda';
import {
  ResourceGroupsTaggingAPIClient,
  GetResourcesCommand
} from '@aws-sdk/client-resource-groups-tagging-api';
import {
  CloudWatchLogsClient,
  DescribeSubscriptionFiltersCommand,
  PutSubscriptionFilterCommand
} from '@aws-sdk/client-cloudwatch-logs';

export default AwsSdkWrap({
  configService: {},
  services: {
    S3: S3Client,
    'S3:CMD': {
      PutObjectCommand,
      ListObjectsV2Command,
      DeleteObjectsCommand
    },
    SQS: SQSClient,
    'SQS:CMD': {
      SendMessageBatchCommand
    },
    Lambda: LambdaClient,
    'Lambda:CMD': {
      GetFunctionCommand
    },
    ResourceGroupsTaggingAPI: ResourceGroupsTaggingAPIClient,
    'ResourceGroupsTaggingAPI:CMD': {
      GetResourcesCommand
    },
    CloudWatchLogs: CloudWatchLogsClient,
    'CloudWatchLogs:CMD': {
      DescribeSubscriptionFiltersCommand,
      PutSubscriptionFilterCommand
    }
  }
});
