import { wrap as asyncWrap } from 'lambda-async';
import { wrap as cfnWrap } from 'lambda-cfn-hook';
import processLogs_ from './logic/process-logs.js';
import batcherHandler_ from './logic/batcher-handler.js';
import bundlerHandler_ from './logic/bundler-handler.js';
import subscribe_ from './logic/subscribe.js';
import emptyBucket_ from './logic/empty-bucket.js';

export const batcherHandler = asyncWrap(batcherHandler_);
export const bundlerHandler = asyncWrap(bundlerHandler_);
export const processLogs = asyncWrap(processLogs_);
export const subscribe = cfnWrap(subscribe_, { silent: true });
export const emptyBucket = cfnWrap(emptyBucket_);
