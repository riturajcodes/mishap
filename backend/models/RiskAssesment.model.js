// models/RiskAssessment.model.js
import mongoose from "mongoose";

const RiskAssessmentSchema = new mongoose.Schema({
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
  },
  sourceType: {
    type: String,
    enum: ["Sensor", "Tank", "Line"],
    required: true,
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "sourceType", // dynamically reference source model
    required: true,
  },
  riskType: {
    type: String,
    enum: [
      "Leakage",
      "Overpressure",
      "Fire Hazard",
      "Toxic Gas",
      "Corrosion",
      "Equipment Failure",
      "Overheating",
      "Flood Risk",
      "Earthquake Structural Risk",
      "Human Error"
    ],
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ["Low", "Moderate", "High", "Critical"],
    default: "Low",
  },
  probability: {
    type: Number,
    min: 0,
    max: 1,
    required: true, // AI confidence score
  },
  detectedAt: {
    type: Date,
    default: Date.now,
  },
  aiSuggestion: {
    type: String,
    trim: true,
  },
  recommendedAction: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Active", "Resolved", "Ignored"],
    default: "Active",
  },
});

export default mongoose.model("RiskAssessment", RiskAssessmentSchema);
