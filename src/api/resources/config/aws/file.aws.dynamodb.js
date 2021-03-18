import logger from "../../../logger";
import { DynamoTable } from "./config.aws.dynamodb";

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

export const FileTable = {
  tableName: FileTableName,
  create: createTablePromise,
};
