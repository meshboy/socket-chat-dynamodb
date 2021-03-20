import { describe, it } from "mocha";
import "chai/register-should";
import sinon from "sinon";
import { findUserById } from "../../../src/api/resources/user/user.service";
import {
  Session,
  SessionRole,
} from "../../../src/api/resources/session/session.model";
import AwsSdk from "aws-sdk";
import type { User } from "../../../src/api/resources/user/user.model";

describe("User Interface", () => {
  let sinonSandbox;

  beforeEach(function (done) {
    sinonSandbox = sinon.createSandbox();
    done();
  });

  afterEach((done) => {
    sinonSandbox.restore();
    done();
  });

  it("should validate an existing user", async function () {
    const session: Session = {
      id: "fakeId",
      role: SessionRole.User,
    };

    const get = sinonSandbox.stub(
      AwsSdk.DynamoDB.DocumentClient.prototype,
      "get"
    );
    get.returns({
      promise: function () {
        return Promise.resolve({
          Item: {
            id: "fakeId",
            role: SessionRole.User,
            timeCreated: new Date().getTime(),
          },
        });
      },
    });

    const result: User = await findUserById(session.id);

    result.should.exist;
    result.id.should.exist;
    result.id.should.be.equal(session.id);
    result.role.should.exist;
    result.role.should.be.equal(session.role);
  });

  it("should throw an error when a user is not valid", async function () {
    const session: Session = {
      id: "fakeId",
      role: SessionRole.User,
    };

    const get = sinonSandbox.stub(
      AwsSdk.DynamoDB.DocumentClient.prototype,
      "get"
    );
    get.returns({
      promise: function () {
        return Promise.resolve({});
      },
    });

    try {
      await findUserById(session.id);
    } catch (e) {
      e.should.exist;
      e.should.be.equal("User with id [fakeId] is not found");
    }
  });
});
