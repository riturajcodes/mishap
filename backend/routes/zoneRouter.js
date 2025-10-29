const express = require("express");
const router = express.Router();
const zoneCtrl = require("../controllers/zoneCtrl");
const auth = require("../middlewares/authMiddleware");

router.post("/v1/add-new-zone", auth, zoneCtrl.addNewZone);
router.post("/v1/fetch-zones", auth, zoneCtrl.fetchZones);
router.post("/v1/fetch-zone", zoneCtrl.fetchZone);
router.post("/v1/fetch-zone-risk", auth, zoneCtrl.fetchZoneCenterAndRisks);
// router.delete("/zones/:id", auth, zoneCtrl.deleteZone);

module.exports = router;
