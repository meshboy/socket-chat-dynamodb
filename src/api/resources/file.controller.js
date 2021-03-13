import {
  uploadFile,
} from "./file.service";

export const create = (req, res) => {
  const file = req.file;
  if (!req.query.format) {
    req.query.format = "image";
  }
  const { format, isPublic } = req.query;
  uploadFile(file, format, isPublic)
    .then((dataObj) => {
      res.status(dataObj.statusCode).send({ status: true, data: dataObj.data });
    })
    .catch((e) => {
      res.status(e.statusCode).send({ status: false, message: e.message });
    });
};
