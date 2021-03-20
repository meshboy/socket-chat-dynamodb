import type { Session } from "../../session/session.model";
import { verifyToken } from "../../session/session.service";
import logger from "../../../logger";
import { SocketStatus } from "./socket.model";

export const socketMiddleware = async (data, next) => {
  try {
    const { token } = data[1];
    const sessionUser: Session = await verifyToken(token);
    logger.info(
      `::: socket connection with id [${sessionUser.id}] and
          session id [${sessionUser.id}] connected :::`
    );
    return next();
  } catch (e) {
    const err = { status: false, message: SocketStatus.UN_AUTHORISED };
    next(err);
  }
};
