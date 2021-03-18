import { DynamoTable } from "./config.aws.dynamodb";
import logger from "../../../logger";

export const UserTableName = "User";

const UserTableAttributes = {
  TableName: UserTableName,
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

export const UserTable = {
  tableName: UserTableName,
  create: createTablePromise,
};
