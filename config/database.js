const aws = require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({
  accessKeyId: process.env.IAM_ACCESS_ID,
  secretAccessKey: process.env.IAM_SECRET,
  region: 'us-east-1',
});

module.exports = documentClient;
