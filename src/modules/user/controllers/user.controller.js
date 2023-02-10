const catchAsync = require("../../../common/catchAsync");
const appError = require("../../../common/errorHandlers/errorHandler");
const { ErrorMessage, SuccessMessage } = require("../../../common/message");
const { ErrorCode, SuccessCode } = require("../../../common/statusCode");
const crypto = require("crypto");

const User = require("../models/user.model");
const Request = require("../models/request.model");
const Token = require("../models/token.model");
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
const { findByIdAndUpdate } = require("../models/request.model");

module.exports = {
  // *****************************common signup api*************************************//

  signup: async (req, res) => {
    try {
      const payload = req.body;

      const { first_name, last_name, email, password, mobile_number, role } =
        payload;

      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        throw new appError(
          ErrorMessage.EMAIL_ALREADY_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      }
      const checkMobile = await User.findOne({ mobile_number });
      if (checkMobile) {
        throw new appError(
          ErrorMessage.MOBILE_ALREADY_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      }
      let hashPassword = generateHash(password);

      payload["password"] = hashPassword;

      const user = User.create(payload);

      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.SIGNUP_SUCCESS,
        user
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************common login  api*************************************//

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const loggedUser = await User.findOne({
        email,
      });

      if (!loggedUser) {
        throw new appError(ErrorMessage.EMAIL_INCORRECT, ErrorCode.NOT_FOUND);
      }
      let has = compareHash(password, loggedUser.password);
      if (!has) {
        throw new appError(
          ErrorMessage.INCORRECT_PASSWORD,
          ErrorCode.NOT_FOUND
        );
      }
      let token = generateToken({ id: loggedUser._id });

      let Res = {
        email: email,
        mobile_number: loggedUser.mobile_number,
        role: loggedUser.role,
        first_name: loggedUser.first_name,
        last_name: loggedUser.last_name,
        token: token,
      };
      helper.sendResponseWithData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.LOGIN_SUCCESS,
        Res
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************list builders api*************************************//

  listBuilder: async (req, res) => {
    try {
      const authbuilder = await User.findById(req.body.userId);
      if (!authbuilder) {
        throw new appError(ErrorMessage.USER_NOT_FOUND, ErrorCode.NOT_FOUND);
      }

      const builderData = await User.find({
        role: "BUILDER",
      });

      if (builderData.length == 0) {
        throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      let final = {
        user: builderData,
      };
      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        final,
        SuccessMessage.DATA_FOUND
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************forget password  api*************************************//

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new appError(
          ErrorMessage.EMAIL_NOT_REGISTERED,
          ErrorCode.NOT_FOUND
        );
      }
      const temporaryPass = randomPassword();
      const temporaryHash = generateHash(temporaryPass);
      const updatedUserPass = await User.updateOne(
        { email },
        { password: temporaryHash },
        { new: true }
      );
      const html = `<h1> here is your temporary password </h1><p>${temporaryPass}</p>`;
      await sendMail(
        global.gConfig.nodemailer_mail,
        email,
        SuccessMessage.FORGET_SUCCESS,
        html
      );

      helper.sendResponseWithoutData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.EMAIL_SEND,
        temporaryPass
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************reset password api*************************************//

  resetPassword: async (req, res) => {
    try {
      const { temporaryPass, newPass } = req.body;
      const passVerify = await User.findOne({ password: temporaryPass });
      if (!passVerify) {
        throw new appError(ErrorMessage.DATA_NOT_FOUND, ErrorCode.NOT_FOUND);
      }

      const newPassword = await User.findOneAndUpdate(
        { email: passVerify.email },
        { password: newPass },
        { new: true }
      );

      helper.sendResponseWithoutData(
        res,
        SuccessCode.SUCCESS,
        SuccessMessage.PASSWORD_RESET_SUCCESSFUL,
        newPassword
      );
    } catch (error) {
      console.log(error);
    }
  },

  // *****************************update user profile api*************************************//

  updateUser: async (req, res) => {
    try {
      const payload = req.body;

      const { first_name, last_name, email, password, mobile_number } = payload;

      let update = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: payload },
        { new: true }
      );

      helper.commonResponse(
        res,
        SuccessCode.SUCCESS,
        update,
        SuccessMessage.PROFILE_DETAILS
      );
    } catch (error) {
      console.log(error);
    }
  },
};
