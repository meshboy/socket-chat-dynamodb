import AwsSdk from "aws-sdk";

export const S3 = () => {
  return new AwsSdk.S3({
    accessKeyId: process.env.AWS_CLIENT_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: "v4",
  });
};
