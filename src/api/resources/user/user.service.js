import Joi from "joi";
import {BAD_REQUEST, OK} from "../../modules/status";
import type {User, UserValidity} from "./user.model";
import {DynamoDb} from "../config/aws/config.aws.dynamodb";
import logger from "../../logger";
import {UserTableName} from "../config/aws/user.aws.dynamodb";
import {isObjectEmpty} from "../../modules/util";
import {generateSessionId} from "../session/session.service";
import {SessionRole} from "../session/session.model";

export const createNewUser = async ({ params }) => {
  if (!params) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: "request body is required",
    });
  }
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });

  const validateSchema = Joi.validate(params, schema);
  if (validateSchema.error) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: validateSchema.error.details[0].message,
    });
  }

  const existUserParams = {
    TableName: UserTableName,
    Key: {
      ...params,
    },
    ProjectionExpression: "id, timeCreated",
  };

  try {
    const existingUser = await DynamoDb().get(existUserParams).promise();
    if (existingUser && !isObjectEmpty(existingUser)) {
      logger.info(
        `::: Existing user found with a response [${JSON.stringify(
          existingUser
        )}] :::`
      );
      const user: User = existingUser.Item;
      user.token = generateSessionId(user.id, SessionRole.User);
      return Promise.resolve({
        statusCode: OK,
        data: user,
      });
    }

    const currentTime = new Date().getTime();
    const userParams = {
      TableName: UserTableName,
      Item: {
        ...params,
        timeCreated: currentTime,
        timeUpdated: currentTime,
      },
    };

    // note: put with await does not return object, you might want to
    // consider using callback if this is very important
    await DynamoDb().put(userParams).promise();
    logger.info(
      `::: New user created with param [${JSON.stringify(userParams.Item)}] :::`
    );

    return Promise.resolve({
      statusCode: OK,
      data: {
        id: userParams.Item.id,
        token: generateSessionId(userParams.Item.id, SessionRole.User),
        timeCreated: userParams.Item.timeCreated,
      },
    });
  } catch (e) {
    logger.error(
      `::: failed to create user with error : [${JSON.stringify(e)}] :::`
    );
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: "Failed to create User",
    });
  }
};

export const validateExistingUser = async ({ params }) => {
  if (!params) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: "request body is required",
    });
  }
  const schema = Joi.array().items(
    Joi.object()
      .keys({
        id: Joi.string().required(),
      })
      .required()
  );

  const validateSchema = Joi.validate(params, schema);
  if (validateSchema.error) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: validateSchema.error.details[0].message,
    });
  }
  const userValidityList: UserValidity[] = [];

  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const existUserParams = {
      TableName: UserTableName,
      Key: {
        id: param.id,
      },
    };

    try {
      const existingUser = await DynamoDb().get(existUserParams).promise();
      if (existingUser && !isObjectEmpty(existingUser)) {
        logger.info(
          `::: Existing user found with a response [${JSON.stringify(
            existingUser
          )}] :::`
        );
        const item: User = existingUser.Item;
        userValidityList.push({ id: item.id, isAvailable: true });
      } else {
        userValidityList.push({ id: param.id, isAvailable: false });
      }
    } catch (e) {
      logger.error(
        `::: failed to validate users with error : [${JSON.stringify(e)}] :::`
      );
      userValidityList.push({ id: params.id, isAvailable: false });
    }
  }
  return Promise.resolve({
    statusCode: OK,
    data: userValidityList,
  });
};
