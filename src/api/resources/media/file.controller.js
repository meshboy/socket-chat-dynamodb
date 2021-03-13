import {
  uploadFile,
} from "./file.service";

export const create = (req, res) => {
  const file = req.file;
  uploadFile(file)
    .then((dataObj) => {
      res.status(dataObj.statusCode).send({ status: true, data: dataObj.data });
    })
    .catch((e) => {
      console.log(e)
      res.status(e.statusCode).send({ status: false, message: e.message });
    });
};
