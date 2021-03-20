import { describe, it, xit } from "mocha";
import "chai/register-should";
import io from "socket.io-client";
import sinon, { fake } from "sinon";
import {
  SocketStatus,
  SocketTopics,
} from "../../../src/api/resources/chat/conn/socket.model";
import { SessionRole } from "../../../src/api/resources/session/session.model";
import AwsSdk from "aws-sdk";
import { generateSessionId } from "../../../src/api/resources/session/session.service";
import type { Session } from "../../../src/api/resources/session/session.model";
import logger from "../../../src/api/logger";
import type { Chat } from "../../../src/api/resources/chat/model";

describe("Chat Interface", () => {
  const url = `http://localhost:3500`;
  let server,
    sinonSandbox,
    options = {
      transports: ["websocket"],
      "force new connection": false,
    };

  beforeEach(function (done) {
    // start the server
    server = require("./../../../src").server;
    sinonSandbox = sinon.createSandbox();
    done();
  });

  afterEach((done) => {
    sinonSandbox.restore();
    done();
  });

  it("should receive welcome message", () => {
    const client = io.connect(url, options);

    client.on(SocketTopics.HELLO, (message) => {
      console.log(message)
      message.should.equal("Welcome to Admoni Chat");
    });
  });

  it("should send a chat to a recipient", async function () {});

  it("should send a chat to a recipient", async function () {
    const get = sinonSandbox.stub(
      AwsSdk.DynamoDB.DocumentClient.prototype,
      "get"
    );
    get.returns({
      promise: function () {
        return Promise.resolve({
          Item: {
            id: "fakeUserId",
            role: SessionRole.User,
            timeCreated: new Date().getTime(),
          },
        });
      },
    });

    const client = io.connect(url, options);

    const session: Session = {
      id: "fakeUserId",
      role: SessionRole.User,
    };
    const fakeToken = generateSessionId(session.id, session.role);

    const sender: Chat = {
      token: fakeToken,
      message: "hello Admoni bobo",
      senderUsername: "sender john",
      recipientUsername: "receiver mike",
      messageType: "TEXT",
      recipientId: "fakeRecipient",
      timeCreated: new Date().getTime(),
    };

    // push message
    client.emit(SocketTopics.CHAT_MESSAGE, sender);

    // message received
    client.on(`${session.id}:${sender.recipientId}`, (receiver: Chat) => {
      receiver.should.exist;
      sender.message.should.be.equal(receiver.message);
    });

    client.on(SocketTopics.ERROR, (error) => {
      logger.error(error);
    });
  });
});
