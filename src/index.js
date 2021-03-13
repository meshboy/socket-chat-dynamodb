import http from "http";
import logger from './api/logger';
import app from './api/server';

// handle all uncaught errors
process.on("uncaughtException", function(err) {
  logger.error(`uncaught error has been fired with Error: ${err}`);
});

const server = http.createServer(app);
const port = process.env.PORT || 3080;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
