const express = require("express");
const app = express();

const config = require("./config/config.json");
//const db = require("./src/common/db/database");
const index = require("./src/modules/user/routes/indexRoute");
const cors = require("cors");
app.use(cors());
const appError = require("./src/common/errorHandlers/errorHandler");
const errorController = require("./src/common/errorHandlers/errorController");
const apiLogger = require("./src/common/logger/apiRoutelogger");
const dbconnection = require("./src/common/db/database");
dbconnection.connectDB();

app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));

app.use("/api", apiLogger, index);

app.all("*", (req, res, next) => {
  throw new appError(
    `Requested URL http://localhost:${global.gConfig.node_port}${req.path} not found!`,
    404
  );
});

app.use(errorController);

app.listen(global.gConfig.node_port, function () {
  console.log("Server is listening on", global.gConfig.node_port);
});
