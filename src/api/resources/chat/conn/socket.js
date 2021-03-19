import socketAuth from "socketio-auth";
import adapter from "socket.io-redis";
import type { Session } from "../../session/session.model";
import { verifyToken } from "../../session/session.service";
import { SocketStatus } from "./socket.model";
import { RedisClient } from "../../../redis";
import logger from "../../../logger";

const socketAdapter = () => {
  return adapter({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  });
};

export const ChatSocket = ({ server, io }) => {
  io.attach(server);
  io.adapter(socketAdapter());

  socketAuth(io, {
    authenticate: async (socket, data, callback) => {
      try {
        const { token } = data;
        const sessionUser: Session = await verifyToken(token);

        const canConnect = await RedisClient.setAsync(
          `users:${sessionUser.id}`,
          socket.id,
          "NX",
          "EX",
          30
        );

        if (!canConnect) {
          return callback({ message: "ALREADY_LOGGED_IN" });
        }

        socket.user = sessionUser;
        return callback(null, true);
      } catch (e) {
        return callback({ message: SocketStatus.UN_AUTHORISED });
      }
    },
    postAuthenticate: async (socket) => {
      logger.info(`::: socket [${socket.id}] re-authenticated :::`);

      // Socket.IO pings connection every 25secs to check if user is still active. To renew the lock, hook into the packet
      // event of socket connection to intercept ping packages.
      socket.conn.on("packet", async (packet) => {
        if (socket.auth && packet.type === "ping") {
          await RedisClient.setAsync(
            `users:${socket.user.id}`,
            socket.id,
            "XX",
            "EX",
            30
          );
        }
      });
    },
    disconnect: async (socket) => {
      logger.info(`::: socket [${socket.id}] disconnected :::`);

      if (socket.user) {
        await RedisClient.delAsync(`users:${socket.user.id}`);
      }
    },
  });
};
