const mongoose = require("mongoose");
// const logger = require("../../../common/logger/logger");
// const { generateHash } = require('../../../common/commonFunction');
const schema = mongoose.Schema;
var requestModel = new schema(
  {
    clientId: {
      type: schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    property_number: {
      type: String,
      unique: true,
      // required: true,
    },
    property_size: {
      type: String,
      // required: true,
    },
    floor_requirement: {
      type: String,
      // required: true,
    },

    additional_details: {
      type: String,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("requests", requestModel);
