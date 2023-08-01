import crypto from 'crypto';
import { putGzipObject } from './util/s3.js';

export default async (event, context) => {
  const lines = event.Records.map(({ body }) => body);
  const data = lines.join('\n');
  const hash = crypto.createHash('md5').update(data).digest('hex');

  const timestamps = lines.map((line) => JSON.parse(line).logEvent.timestamp);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  const [year, month, day, hour] = new Date(minTimestamp)
    .toISOString().split(/[-T:]/);
  await putGzipObject(
    process.env.LOG_STREAM_BUCKET_NAME,
    `batch/${year}/${month}/${day}/${hour}/${minTimestamp}-${maxTimestamp}-${hash}.json.gz`,
    data
  );
};
