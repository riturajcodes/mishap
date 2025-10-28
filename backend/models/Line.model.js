import mongoose from "mongoose";

const PipelineSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
    name: { type: String, required: true },
    lineType: {
      type: String,
      enum: ["CrudeOil", "Gas", "Water", "Chemical", "Steam", "Power"],
      default: "CrudeOil",
    },
    lengthMeters: Number,
    diameterMm: Number,
    material: String,
    pressureRating: Number,
    temperatureRating: Number,

    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sensor" }],

    leakDetected: { type: Boolean, default: false },
    corrosionStatus: {
      type: String,
      enum: ["Good", "Moderate", "Severe"],
      default: "Good",
    },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    lastInspection: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Pipeline", PipelineSchema);
