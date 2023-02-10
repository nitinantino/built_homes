const router = require("express").Router();

const user = require("./user.route");
const request = require("./request.route");

router.use("/user", user);
router.use("/request", request);

module.exports = router;
