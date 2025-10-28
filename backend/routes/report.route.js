const express = require("express");
const { generateRiskReport } = require("./controllers/aiController");

const router = express.Router();

router.post("/api/v1/report", generateRiskReport);

module.exports = router;
