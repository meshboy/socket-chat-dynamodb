import express from "express";
import { errorHandler } from "./modules/error-handler";
import { secureRoute } from "./middleware";
import { FileRouter } from "./resources/media";
import { HelloRouter } from "./resources/health";
import { UserRouter } from "./resources/user";
import { ChatRouter } from "./resources/chat";

export const router = express.Router();
router.use(secureRoute);

router.use("/", HelloRouter);
router.use("/file", FileRouter);
router.use("/user", UserRouter);
router.use("/chat", ChatRouter);
router.use(errorHandler);
