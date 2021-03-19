import { ChatTableName } from "../config/aws/chat.aws.dynamodb";
import { DynamoDb } from "../config/aws/config.aws.dynamodb";
import { OK } from "../../modules/status";
import type { Chat } from "./model";

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
