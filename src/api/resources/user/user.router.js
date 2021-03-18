import express from "express";
import { create, validate } from "./user.controller";

export const UserRouter = express.Router();
UserRouter.route("/").post(create);
UserRouter.route("/validate").post(validate);
