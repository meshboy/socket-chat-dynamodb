import { describe, it, xit } from "mocha";
import "chai/register-should";
import io from "socket.io-client";
import sinon from "sinon";
import {
  SocketStatus,
  SocketTopics,
} from "../../../src/api/resources/chat/conn/socket.model";

describe("Chat Authentication", () => {
  const url = `http://localhost:3500`;
  let server,
    sinonSandbox,
    options = {
      transports: ["websocket"],
      "force new connection": true,
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

  it("should return unauthorised for invalid user", function () {
    const client = io.connect(url, options);

    client.emit(SocketTopics.CHAT_MESSAGE, {
      message: "Hello",
      token: "randomToken",
    });

    client.on(SocketTopics.ERROR, (error) => {
      error.should.exist;
      error.status.should.be.equal(false);
      error.message.should.be.equal(SocketStatus.UN_AUTHORISED);
    });
  });
});
