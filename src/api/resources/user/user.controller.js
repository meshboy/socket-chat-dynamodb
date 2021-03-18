import { createNewUser, validateExistingUser } from "./user.service";

export const validate = (req, res) => {
  const params = req.body;
  validateExistingUser({ params })
    .then((dataObj) => {
      res.status(dataObj.statusCode).send({ status: true, data: dataObj.data });
    })
    .catch((e) => {
      res.status(e.statusCode).send({ status: false, message: e.message });
    });
};

export const create = (req, res) => {
  const params = req.body;
  createNewUser({ params })
    .then((dataObj) => {
      res.status(dataObj.statusCode).send({ status: true, data: dataObj.data });
    })
    .catch((e) => {
      res.status(e.statusCode).send({ status: false, message: e.message });
    });
};
