import { UN_AUTHORISED } from "./modules/status";
import basicAuth from "basic-auth";
import compare from "tsscmp";
import logger from "./logger";
import bodyparser from "body-parser";
import { errorHandler } from "./modules/error-handler";

const checkAccess = (name: string, password: string): Boolean => {
  let valid: Boolean = true;

  // prevent short-cricuit and use timing-safe compare
  valid = compare(name, process.env.USERNAME) && valid;
  valid = compare(password, process.env.PASSWORD) && valid;
  return valid;
};

export const secureRoute = (req, res, next) => {
  const credentials = basicAuth(req);

  const path = req.path;
  const method = req.method;

  if (Object.is(method, "GET") && path === "/") {
    return next();
  }

  // check against user credentials stored
  if (!credentials || !checkAccess(credentials.name, credentials.pass)) {
    logger.info(`Route is not authorized`);
    return res.status(UN_AUTHORISED).send({
      status: false,
      message: "UnAuthorized",
    });
  } else {
    return next();
  }
};

const middleware = (app) => {
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(bodyparser.json({ limit: "500mb" }));
  app.use(bodyparser.urlencoded({ limit: "500mb", extended: true }));
  app.use(errorHandler);
};

export default middleware;
