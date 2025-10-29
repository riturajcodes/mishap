const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zoneType: {
    type: String,
    enum: [
      "RefineryUnit",
      "StorageYard",
      "PumpStation",
      "PowerHouse",
      "ControlRoom",
      "PipelineSection",
      "SafetyZone",
    ],
    required: true,
  },
  description: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  fireSuppressionSystem: {
    type: String,
    enum: ["Sprinkler", "Foam", "CO2", "DryPowder", "None"],
    default: "Foam",
  },
  ventilation: {
    type: String,
    enum: ["Natural", "Forced", "ExplosionProof"],
    default: "Forced",
  },
  riskScore: { type: Number, min: 0, max: 100, default: 0 },
  status: {
    type: String,
    enum: ["Active", "Maintenance", "Shutdown"],
    default: "Active",
  },
}, { timestamps: true });

module.exports = mongoose.model("Zone", ZoneSchema);
