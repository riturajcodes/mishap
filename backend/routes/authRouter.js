const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");

router.post("/v1/login", authCtrl.login);

router.post("/v1/generateaccesstoken", authCtrl.generateAccessToken);

router.post("/v1/logout", authCtrl.logout);

module.exports = router;