const Zone = require("../models/Zone.model");
const User = require("../models/User");
const RiskAssessment = require("../models/RiskAssesment.model")
const Line = require("../models/Line.model")
const Tank = require("../models/Tank.model")
const Sensor = require("../models/Sensor.model")

const zoneCtrl = {
    // 🧩 ADD NEW ZONE
    addNewZone: async (req, res) => {
        try {
            const {
                name,
                zoneType,
                description,
                longitude,
                latitude,
                fireSuppressionSystem,
                ventilation,
                riskScore,
                status,
            } = req.body;

            if (!name || !zoneType) {
                return res
                    .status(400)
                    .json({ msg: "Name and Zone Type are required fields." });
            }

            const lng = parseFloat(longitude);
            const lat = parseFloat(latitude);
            if (isNaN(lng) || isNaN(lat)) {
                return res
                    .status(400)
                    .json({ msg: "Valid latitude and longitude are required." });
            }

            // 🧱 Create zone
            const newZone = new Zone({
                name,
                zoneType,
                description,
                location: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                fireSuppressionSystem: fireSuppressionSystem || "Foam",
                ventilation: ventilation || "Forced",
                riskScore: riskScore ? Number(riskScore) : 0,
                status: status || "Active",
            });

            await newZone.save();

            res.status(200).json({
                message: "Zone added successfully.",
                zone: newZone,
            });
        } catch (err) {
            console.error("❌ Error adding zone:", err);
            res
                .status(500)
                .json({ msg: "An error occurred while adding the zone." });
        }
    },

    // 📦 FETCH ALL ZONES
    fetchZones: async (req, res) => {
        try {
            const zones = await Zone.find({})
                .sort({ createdAt: -1 });
            res.status(200).json(zones);
        } catch (err) {
            console.error("Error fetching zones:", err);
            res.status(500).json({ msg: "Error fetching zones." });
        }
    },

    // 🔍 FETCH SINGLE ZONE
    fetchZone: async (req, res) => {
        try {
            const { id } = req.body;

            // 1️⃣ Find the zone itself
            const zone = await Zone.findById(id).lean();
            if (!zone) {
                return res.status(404).json({ msg: "Zone not found." });
            }

            // 2️⃣ Find all lines in this zone and populate their sensors manually
            const lines = await Line.find({ zone: id }).lean();
            for (let line of lines) {
                const sensors = await Sensor.find({ line: line._id }).lean();
                line.sensors = sensors;
            }

            // 3️⃣ Find all tanks in this zone and populate their sensors manually
            const tanks = await Tank.find({ zone: id }).lean();
            for (let tank of tanks) {
                const sensors = await Sensor.find({ tank: tank._id }).lean();
                tank.sensors = sensors;
            }

            // 4️⃣ Construct the final combined response
            const fullZoneData = {
                ...zone,
                lines,
                tanks,
            };

            res.status(200).json(fullZoneData);
        } catch (err) {
            console.error("❌ Error fetching zone:", err);
            res.status(500).json({ msg: "Error fetching zone." });
        }
    },
    fetchZoneCenterAndRisks: async (req, res) => {
        try {
            const { zoneId } = req.body;

            if (!zoneId) return res.status(400).json({ msg: "zoneId is required." });

            // 🧭 Get zone details
            const zone = await Zone.findById(zoneId);
            if (!zone) return res.status(404).json({ msg: "Zone not found." });

            // ⚠️ Get all risks linked to this zone
            const risks = await RiskAssessment.find({ zone: zoneId })
                .sort({ detectedAt: -1 });

            // 🗺️ Extract coordinates
            const [longitude, latitude] = zone.location?.coordinates || [null, null];
            if (longitude === null || latitude === null) {
                return res.status(400).json({ msg: "Zone has invalid coordinates." });
            }

            // ✅ Return structured JSON
            res.status(200).json({
                zone: {
                    id: zone._id,
                    name: zone.name,
                    zoneType: zone.zoneType,
                    status: zone.status,
                    description: zone.description,
                    fireSuppressionSystem: zone.fireSuppressionSystem,
                    ventilation: zone.ventilation,
                    riskScore: zone.riskScore,
                },
                center: {
                    latitude,
                    longitude,
                },
                risks: risks.map(risk => ({
                    id: risk._id,
                    riskType: risk.riskType,
                    riskLevel: risk.riskLevel,
                    probability: risk.probability,
                    aiSuggestion: risk.aiSuggestion,
                    recommendedAction: risk.recommendedAction,
                    status: risk.status,
                    detectedAt: risk.detectedAt,
                })),
            });
        } catch (err) {
            console.error("❌ Error fetching zone data:", err);
            res.status(500).json({ msg: "Error fetching zone center and risks." });
        }
    },

};

module.exports = zoneCtrl;
