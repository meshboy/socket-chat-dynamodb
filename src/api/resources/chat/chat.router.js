import express from "express";
import { get } from "./chat.controller";

export const ChatRouter = express.Router();
ChatRouter.route("/:senderId/:recipientId").get(get);
