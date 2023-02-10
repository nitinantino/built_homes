const mongoose = require("mongoose");
// const logger = require("../../../common/logger/logger");
// const { generateHash } = require('../../../common/commonFunction');
const schema = mongoose.Schema;
var userModel = new schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile_number: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    profile_image: {
      type: String,
    },

    role: {
      type: String,
      enum: ["CLIENT", "BUILDER"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userModel);
