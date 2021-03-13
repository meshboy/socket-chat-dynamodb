import { OK } from "../../modules/status";

export const hello = (req, res) =>
  res.status(OK).send({ status: true, message: "Welcome to Admoni Service" });
