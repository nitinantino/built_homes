const appError = require("../../../common/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../../../common/message");
const { ErrorCode, SuccessCode } = require("../../../common/statusCode");

// const Client = require("../models/client.model");
const User = require("../models/user.model");
const Request = require("../models/request.model");
const Quotation = require("../models/quotation.model");

const {
  sendMail,
  sendMailNotify,
} = require("../../../common/utils/nodemailer");

const {
  compareHash,
  generateToken,
  randomPassword,
  generateHash,
} = require("../../../common/commonFunction");
const helper = require("../../../common/commonResponsehandler");
const { findByIdAndUpdate } = require("../models/user.model");

module.exports = {
  // *****************************create property request api*************************************//

  createRequest: async (req, res) => {
    try {
      if (req.user.role === "BUILDER") {
        throw new appError(
          ErrorMessage.USER_NOT_AUTHORISED,
          ErrorCode.NOT_FOUND
        );
      }

      const {
        property_number,
        property_size,
        floor_requirement,
        additional_details,
      } = req.body;

      const reqAuth = await Request.findOne({ property_number });
      console.log(reqAuth);
      if (reqAuth) {
        throw new appError(
          ErrorMessage.PROPERTY_REQUEST_ALREADY_EXIST,
          ErrorCode.NOT_FOUND
        );
      }

      const propertyData = await Request.create({
        clientId: req.user._id,
        property_number,
        property_size,
        floor_requirement,
        additional_details,
      });

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.REQUEST_CREATED,
        propertyData
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************list all request api*************************************//

  listAllReq: async (req, res) => {
    try {
      if (req.user.role === "CLIENT") {
        throw new appError(
          ErrorMessage.USER_NOT_AUTHORISED,
          ErrorCode.NOT_FOUND
        );
      }

      const List = await Request.find({ property_status: "OPEN" });

      if (!List) {
        throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
      }

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.REQUEST_CREATED,
        List
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************create quotation by builder api*************************************//

  createQuotation: async (req, res) => {
    try {
      if (req.user.role === "CLIENT") {
        throw new appError(
          ErrorMessage.USER_NOT_AUTHORISED,
          ErrorCode.NOT_FOUND
        );
      }

      const { requestId, description } = req.body;

      const quotation = await Quotation.create({
        builderId: req.user._id,
        requestId,
        description,
      });

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.REQUEST_CREATED,
        quotation
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************list of all quotation by client api*************************************//

  listOfQuotation: async (req, res) => {
    try {
      if (req.user.role === "BUILDER") {
        throw new appError(
          ErrorMessage.USER_NOT_AUTHORISED,
          ErrorCode.NOT_FOUND
        );
      }

      const { requestId } = req.query;

      const quotation = await Quotation.find({
        requestId,
      });
      console.log(quotation);

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.REQUEST_CREATED,
        quotation
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************response to Quotation by client api*************************************//

  responseToQuotation: async (req, res) => {
    try {
      if (req.user.role === "BUILDER") {
        throw new appError(
          ErrorMessage.USER_NOT_AUTHORISED,
          ErrorCode.NOT_FOUND
        );
      }

      const { quotationId } = req.query;

      const quotation = await Quotation.findByIdAndUpdate(
        quotationId,
        {
          status: "ACCEPTED",
        },
        {
          new: true,
        }
      );
      if (!quotation) {
        throw new appError(
          ErrorMessage.QUOTATION_NOT_FOUND,
          ErrorCode.NOT_FOUND
        );
      }
      const updateAllquotation = await Quotation.updateMany(
        {
          requestId: quotation.requestId,
          status: "PENDING",
        },
        {
          status: "DECLINED",
        }
      );

      const updateRequest = await Request.findByIdAndUpdate(
        quotation.requestId,
        {
          status: "CLOSED",
        }
      );

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.REQUEST_CREATED,
        quotation
      );
    } catch (error) {
      console.log(error);
    }
  },
};
