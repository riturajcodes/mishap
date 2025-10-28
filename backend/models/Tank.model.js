import mongoose from "mongoose";

const TankSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", required: true },
    name: { type: String, required: true },
    tankType: {
      type: String,
      enum: ["CrudeOil", "Diesel", "Petrol", "LPG", "Chemical", "Water", "Other"],
      default: "CrudeOil",
    },
    capacityLiters: Number,
    currentLevelLiters: Number,
    material: String,
    pressureRating: Number,
    temperatureLimit: Number,

    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sensor" }],

    // Safety
    corrosionStatus: {
      type: String,
      enum: ["Good", "Moderate", "Severe"],
      default: "Good",
    },
    leakDetected: { type: Boolean, default: false },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    lastInspection: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Tank", TankSchema);
