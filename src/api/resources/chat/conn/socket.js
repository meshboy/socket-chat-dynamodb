import type { Session } from "../../session/session.model";
import { verifyToken } from "../../session/session.service";
import { SocketStatus, SocketTopics } from "./socket.model";
import { RedisClient } from "../../../redis";
import logger from "../../../logger";
import { socketMiddleware } from "./socket.middleware";
import { createChats } from "../chat.service";
export const ChatSocket = (io) => {
  io.on("connection", (socket) => {
    logger.info(`::: connection with id [${socket.id}] :::`);
    socket.emit(SocketTopics.HELLO, "Welcome to Admoni Chat");

    socket.use(socketMiddleware);

    socket.on(SocketTopics.CHAT_MESSAGE, async (data) => {
      console.log(data)
      const { token, ...chat } = data;
      const sessionUser: Session = await verifyToken(data.token);
      logger.info(
        `::: message detected with user id [${
          sessionUser.id
        }] with model [${JSON.stringify(chat)}]:::`
      );
      // const connectionStatus = await RedisClient.setAsync(
      //   `users:${socket.id}`,
      //   sessionUser.id,
      //   "NX",
      //   "EX",
      //   30
      // );

      io.emit(`${sessionUser.id}:${chat.recipientId}`, JSON.stringify(chat));

      // create chat pushed by users
      chat.senderId = sessionUser.id;
      createChats(chat).then((doc) => {});
    });

    socket.on(SocketTopics.DISCONNECT, async (data) => {
      if (socket.user) {
        await RedisClient.delAsync(`users:${socket.user.id}`);
      }
    });

    socket.on(SocketTopics.GLOBAL_ERROR, (err) => {
      logger.error(
        `::: Error occurred with error message [${JSON.stringify(err)}] :::`
      );
      socket.emit(SocketTopics.ERROR, err);
    });
  });
};
