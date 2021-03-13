import mongoose from "mongoose";
import fs from "fs";
import { BAD_REQUEST, NOT_FOUND, OK } from "../../modules/status";
import logger from "../../logger";
import { S3 } from "../config/aws/config.aws.s3";
import { getFileAttribute } from "../../modules/file.format";
import type { FileAttribute, FileModel } from "./file.model";
import { DynamoDb, FileTableName } from "../config/aws/config.aws.dynamodb";
export const folder = __dirname + "./../uploads";

export const uploadFile = (file) => {
  if (!file) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: "File can not be empty",
    });
  }

  const fileAttribute: FileAttribute = getFileAttribute(file);

  const id = mongoose.Types.ObjectId().toString();
  const fileKey = `${id}.${fileAttribute.extension}`;
  const filePath = file.path;
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: fileContent,
  };

  return new Promise((resolve, reject) => {
    S3().upload(params, function (err, data) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        logger.error(`failed to delete file ${id} with error : ${e}`);
      }
      if (err) {
        logger.error(
          `::: file with name [${
            file.filename
          }] not uploaded with error : ${JSON.stringify(err)} :::`
        );
        reject({ statusCode: BAD_REQUEST, message: "File not uploaded" });
      } else {
        logger.info(
          `::: file uploaded to S3 with response [${JSON.stringify(data)}] :::`
        );

        const model: FileModel = {
          id,
          ...fileAttribute,
        };
        return saveFile(model)
          .then((doc) => resolve(doc))
          .catch((err) => reject(err));
      }
    });
  });
};

const saveFile = (model: FileModel) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: FileTableName,
      Item: model,
    };

    DynamoDb().put(params, function (err, data) {
      if (err) {
        logger.error(
          `::: failed to save file [${JSON.stringify(
            model
          )}] with error [${JSON.stringify(err)}] :::`
        );
        reject({ statusCode: BAD_REQUEST, message: "File not uploaded" });
      } else if (data) {
        logger.info(
          `::: file successfully saved with response [${JSON.stringify(
            data
          )}] :::`
        );
        resolve({ statusCode: OK, data: { id: model.id } });
      } else {
        logger.error(
          `::: failed to save file [${JSON.stringify(
            model
          )}] with empty response :::`
        );
        reject({ statusCode: BAD_REQUEST, message: "File not uploaded" });
      }
    });
  });
};
