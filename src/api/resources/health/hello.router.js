import express from "express";
import { hello } from "./health.controller";

export const HelloRouter = express.Router();
HelloRouter.route("/").get(hello);
