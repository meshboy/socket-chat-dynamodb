import Jwt from "jsonwebtoken";
import logger from "../../logger";
import type { Session } from "./session.model";

export const generateSessionId: string = (id: string, role: string) => {
  const secret = process.env.TOKEN_SECRET;
  return Jwt.sign({ id, role }, secret, {});
};

export const verifyToken = (token: string): Session => {
  return Jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      logger.error(`Invalid token with error ${JSON.stringify(err)}`);
      return Promise.reject("Invalid token");
    } else {
      return Promise.resolve(payload);
    }
  });
};
