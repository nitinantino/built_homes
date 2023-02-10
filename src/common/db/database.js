const mongoose = require("mongoose");
const logger = require("../logger/logger");

global.Promise = mongoose.Promise;
const config = require("../../../config/config");
// const db_name = `${global.gConfig.database}`;
// const user_name = `${global.gConfig.user_name}`;
// const password = `${global.gConfig.password}`;

const DB_URL =
  "mongodb+srv://antinonitin:nitin@builthomes.vyh7stl.mongodb.net/built_homes";

module.exports.connectDB = async () => {
  try {
    const connection = await mongoose.connect(DB_URL);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
