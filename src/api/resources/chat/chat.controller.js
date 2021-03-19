import { getChats } from "./chat.service";

export const get = (req, res) => {
  const { senderId, recipientId } = req.params;
  getChats({ senderId, recipientId })
    .then((dataObj) => {
      res.status(dataObj.statusCode).send({ status: true, data: dataObj.data });
    })
    .catch((e) => {
      res.status(e.statusCode).send({ status: false, message: e.message });
    });
};
