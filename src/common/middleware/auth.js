const { ErrorMessage } = require("../message");
const { ErrorCode } = require("../errorHandlers/errorController");
const userModel = require("../../modules/user/models/user.model");
// const enums = require("../helper/enum/enums");
const jwt = require("jsonwebtoken");
const appError = require("../errorHandlers/errorHandler");

//

exports.verifyToken = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(400).json({
      status: false,
      message: "No token found in authorization header!",
    });
  if (!req.headers.authorization.startsWith("Bearer "))
    return res.status(400).json({
      status: false,
      message: "Token format not correct !! Only Bearer token is accepted",
    });

  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedToken = jwt.verify(idToken, global.gConfig.jwtSecretKey);
    if (!decodedToken) return res.error.Unauthorized("Invalid Auth Token");
    const user = await userModel.findById(decodedToken.id);
    if (!user)
      return res.status(400).json({
        status: false,
        message: "no user found with this id",
      });
    user.password = undefined;
    req.user = user;
    next();
  } catch (err) {
    return res.error.Unauthorized(err);
  }
};
