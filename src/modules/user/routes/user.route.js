const router = require("express").Router();
const userController = require("../controllers/user.controller");
// const { signup } = require("../controllers/user.controller");
const { verifyToken } = require("../../../../src/common/middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/listBuilder", userController.listBuilder);
router.post("/forgetpassword", userController.forgetPassword);
router.post("/resetPassword", userController.resetPassword);
router.patch("/updateProfile", verifyToken, userController.updateUser);

module.exports = router;
