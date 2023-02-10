const mongoose = require("mongoose");
// const logger = require("../../../common/logger/logger");
// const { generateHash } = require('../../../common/commonFunction');
const schema = mongoose.Schema;
var quotationModel = new schema(
  {
    builderId: {
      type: schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    requestId: {
      type: schema.Types.ObjectId,
      ref: "request",
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("quotation", quotationModel);
