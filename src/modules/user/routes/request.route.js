const router = require("express").Router();
const userController = require("../controllers/user.controller");
const requestController = require("../controllers/request.controller");
const { verifyToken } = require("../../../../src/common/middleware/auth");

router.post("/createRequest", verifyToken, requestController.createRequest);
router.get("/listRequest", verifyToken, requestController.listAllReq);
router.post("/createQuotation", verifyToken, requestController.createQuotation);
router.get("/listAllQuotation", verifyToken, requestController.listOfQuotation);

router.post(
  "/responseToQuotation",
  verifyToken,
  requestController.responseToQuotation
);

module.exports = router;
