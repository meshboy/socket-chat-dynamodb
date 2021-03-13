import express from "express";
import { create } from "./file.controller";

import multer from "multer";
import { folder } from "./file.service";

export const fileRouter = express.Router();

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

fileRouter.route("/upload").post(upload, create);
