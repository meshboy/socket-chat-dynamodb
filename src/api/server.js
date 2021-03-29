import express from "express";
import cors from "cors";

import { router } from "./router";
import middleware from "./middleware";

import dotenv from "dotenv";
import { connect } from "./db";
dotenv.config();

connect()
  .then(() => {})
  .catch(() => {});

const app = express();
middleware(app);

const corsOption = {
  origin: "*",
  methods: "GET, POST",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use("/", cors(corsOption), router);

export default app;
