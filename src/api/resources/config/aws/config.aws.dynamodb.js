import AwsSdk from "aws-sdk";
import logger from "../../../logger";

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

/**
 * Table name for file attributes
 * @type {string}
 */
export const FileTableName = "File";

/**
 * (S | N | B) for string, number, binary
 * The type of of schema.  Must start with a HASH type, with an optional second RANGE.
 * @type {{TableName: string, Item: {fileId: {}}}}
 */
const FileTableAttributes = {
  TableName: FileTableName,
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
  ],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

const createTablePromise = () => {
  return new Promise((resolve, reject) => {
    DynamoTable().createTable(FileTableAttributes, (err, data) => {
      if (err) {
        logger.error(
          `::: Unable to create table. Error ${JSON.stringify(err)} :::`
        );
        reject(false);
      } else {
        logger.info(
          `::: Created table. Table description ${JSON.stringify(data)} :::`
        );
        resolve(true);
      }
    });
  });
};

export const CreateFileTable = {
  tableName: FileTableName,
  create: createTablePromise,
};
