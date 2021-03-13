import mongoose from "mongoose";
import AwsSdk from "aws-sdk";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import { BAD_REQUEST, NOT_FOUND, OK } from "../modules/status";
import logger from "../logger";
import { SupportedFormat } from "../modules/file.format";

export const folder = __dirname + "./../resources/uploads";

const S3 = () => {
  return new AwsSdk.S3({
    accessKeyId: process.env.AWS_CLIENT_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: "v4",
  });
};

export const uploadFile = (file, format, isPublic) => {
  const extension = SupportedFormat[format];
  if (!extension) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: `File format [${format}] is not supported`,
    });
  }

  if (!file) {
    return Promise.reject({
      statusCode: BAD_REQUEST,
      message: "File can not be empty",
    });
  }

  const id = mongoose.Types.ObjectId().toString();
  const shouldFileBePublic = isPublic && JSON.parse(isPublic);
  const fileKey = shouldFileBePublic
    ? `_pub_${id}.${extension}`
    : `${id}.${extension}`;
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
          `file with name [${file.filename}] not uploaded with error : ${err}`
        );
        reject({ statusCode: BAD_REQUEST, message: "File not uploaded" });
      } else {
        resolve({ statusCode: OK, data: { id } });
      }
    });
  });
};
