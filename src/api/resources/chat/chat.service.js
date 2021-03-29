import { ChatTableName } from "../config/aws/chat.aws.dynamodb";
import { DynamoDb } from "../config/aws/config.aws.dynamodb";
import { OK } from "../../modules/status";
import type { Chat } from "./model";
import { UserTableName } from "../config/aws/user.aws.dynamodb";
import logger from "../../logger";

export const getChats = async ({ senderId, recipientId }) => {
  const params = {
    TableName: ChatTableName,
    Key: {
      senderId,
      recipientId,
    },
    ProjectionExpression:
      "message, messageType, senderId, recipientId, timeCreated",
  };

  const chatResponse = await DynamoDb().scan(params).promise();
  const chats: Chat[] = chatResponse.Items;

  return Promise.resolve({
    statusCode: OK,
    data: chats,
  });
};

export const createChats = async (chat: Chat) => {
  const chatParams = {
    TableName: ChatTableName,
    Item: {
      ...chat,
    },
  };

  try {
    await DynamoDb().put(chatParams).promise();
    logger.info(
      `::: New chat created with param [${JSON.stringify(chatParams.Item)}] :::`
    );
  } catch (e) {
    logger.error(
      `::: failed to create chat with error : [${JSON.stringify(e)}] :::`
    );
  }
};
