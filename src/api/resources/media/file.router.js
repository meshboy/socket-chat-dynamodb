import express from "express";
import { create, get } from "./file.controller";

import multer from "multer";
import { folder } from "./file.service";

export const FileRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_IN_BYTES) },
}).single("media");

FileRouter.route("/upload").post(upload, create);
FileRouter.route("/:id").get(get);
