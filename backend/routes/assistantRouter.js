const router = require("express").Router();
const assistantCtrl = require("../controllers/assistantCtrl");

router.post("/v1/fetch-messages", assistantCtrl.fetchMessages);

router.post("/v1/chat", assistantCtrl.handleAIChat);


module.exports = router;