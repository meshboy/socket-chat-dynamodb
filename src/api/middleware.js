import { UN_AUTHORISED } from "./modules/status";
import basicAuth from "basic-auth";
import compare from "tsscmp";
import logger from "./logger";
import bodyparser from "body-parser";
import { errorHandler } from "./modules/error-handler";
import compression from "compression";
import bodyParser from "body-parser";

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

  if (
    (Object.is(method, "GET") && path === "/") ||
    (Object.is(method, "GET") && path.includes("/socket.io"))
  ) {
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
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(compression());
  app.use(bodyParser.json({ limit: "100mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(bodyparser.json({ limit: "500mb" }));
  app.use(bodyparser.urlencoded({ limit: "500mb", extended: true }));
  app.use(errorHandler);
};

export default middleware;
