import {
  CreateFileTable,
  DynamoTable,
} from "./resources/config/aws/config.aws.dynamodb";
import logger from "./logger";

const tables = [CreateFileTable];

export const connect = async () => {
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    try {
      await loadTable(table);
    } catch (e) {
      console.log(e);
    }
  }
};

function loadTable(table) {
  return new Promise(async (resolve, reject) => {
    const createdTables = await DynamoTable().listTables({}).promise();
    if (!createdTables.TableNames.includes(table.tableName)) {
      const params = { TableName: table.tableName };
      try {
        const createdTable = await table.create(params);
        logger.info(
          `::: [${table.tableName}] created with response [${createdTable}] :::`
        );
        resolve(true);
      } catch (e) {
        logger.error(
          `::: failed to created table [${
            table.tableName
          }] with response [${JSON.stringify(e)}] :::`
        );
        reject(false);
      }
    } else {
      logger.info(`::: Table [${table.tableName}] already created :::`);
      resolve(true);
    }
  });
}