import { UN_AVAILABLE } from "./status";
import logger from "../logger";

export const errorHandler = (error, req, res, next) => {
  logger.error(error.stack);
  res.status(UN_AVAILABLE).json({
    status: false,
    message: error.toString() || "Internal server error",
  });
};
