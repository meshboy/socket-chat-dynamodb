import express from "express";
import { errorHandler } from "./modules/error-handler";
import { secureRoute } from "./middleware";
import { fileRouter } from "./resources";

export const router = express.Router();
router.use(secureRoute);

router.use("/file", fileRouter);
router.use(errorHandler);
