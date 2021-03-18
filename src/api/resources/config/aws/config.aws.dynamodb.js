import AwsSdk from "aws-sdk";

const awsConfig = () => {
  return AwsSdk.config.update({
    accessKeyId: process.env.AWS_CLIENT_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: "v4",
  });
};
export const DynamoDb = () => {
  awsConfig();
  return new AwsSdk.DynamoDB.DocumentClient();
};

export const DynamoTable = () => {
  awsConfig();
  return new AwsSdk.DynamoDB();
};
