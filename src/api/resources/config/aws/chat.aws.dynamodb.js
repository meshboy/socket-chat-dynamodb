import { DynamoTable } from "./config.aws.dynamodb";
import logger from "../../../logger";

export const ChatTableName = "Chat";

const UserTableAttributes = {
  TableName: ChatTableName,
  KeySchema: [
    {
      AttributeName: "senderId",
      KeyType: "HASH",
    },
    {
      AttributeName: "timeCreated",
      KeyType: "RANGE",
    },
  ],
  AttributeDefinitions: [
    { AttributeName: "senderId", AttributeType: "S" },
    { AttributeName: "timeCreated", AttributeType: "N" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

const createTablePromise = () => {
  return new Promise((resolve, reject) => {
    DynamoTable().createTable(UserTableAttributes, (err, data) => {
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

export const ChatTable = {
  tableName: ChatTableName,
  create: createTablePromise,
};
