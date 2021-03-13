import express from "express";
import { hello } from "./health.controller";

export const helloRouter = express.Router();
helloRouter.route("/").get(hello);
