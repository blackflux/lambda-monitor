/* load-hot */
import AwsSdkWrap from 'aws-sdk-wrap';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import {
  SQSClient,
  SendMessageBatchCommand,
  GetQueueAttributesCommand
} from '@aws-sdk/client-sqs';
import {
  LambdaClient,
  GetFunctionCommand,
  PutFunctionConcurrencyCommand,
  ListEventSourceMappingsCommand
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

// TODO: remove unnecessary
export default AwsSdkWrap({
  configService: {},
  services: {
    S3: S3Client,
    'S3:CMD': {
      GetObjectCommand,
      PutObjectCommand,
      HeadObjectCommand,
      ListObjectsV2Command,
      DeleteObjectsCommand
    },
    SQS: SQSClient,
    'SQS:CMD': {
      SendMessageBatchCommand,
      GetQueueAttributesCommand
    },
    Lambda: LambdaClient,
    'Lambda:CMD': {
      GetFunctionCommand,
      PutFunctionConcurrencyCommand,
      ListEventSourceMappingsCommand
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
