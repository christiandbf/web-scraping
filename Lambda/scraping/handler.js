/* eslint-disable import/no-extraneous-dependencies */
const chromeLambda = require('chrome-aws-lambda');

const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const kinesis = new AWS.Kinesis({
  apiVersion: '2013-12-02',
  region: process.env.AWS_REGION,
});

const defaultViewport = {
  width: 1440,
  height: 1080,
};

const getMessage = (event) => {
  const { Records } = event;
  const { body } = Records[0];

  return JSON.parse(body);
};

exports.main = async (event) => {
  const message = getMessage(event);

  const browser = await chromeLambda.puppeteer.launch({
    args: chromeLambda.args,
    executablePath: await chromeLambda.executablePath,
    defaultViewport,
  });

  const page = await browser.newPage();
  await page.goto(message.url);

  const buffer = await page.screenshot();

  const result = await s3
    .upload({
      Bucket: process.env.S3_BUCKET,
      Key: `${(new URL(message.url)).hostname}-${Date.now()}.png`,
      Body: buffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    })
    .promise();

  await kinesis.putRecord({
    Data: JSON.stringify({ url: message.url, date: new Date(), screenshot: result.Location }),
    PartitionKey: Date.now().toString(),
    StreamName: process.env.STREAM_NAME,
  }).promise();

  return { url: result.Location };
};
