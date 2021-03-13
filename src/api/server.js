import express from "express";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";

import { router } from "./router";
import middleware from "./middleware";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(compression());
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

middleware(app);

const corsOption = {
  origin: "*",
  methods: "GET, POST",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use("/", cors(corsOption), router);

export default app;
