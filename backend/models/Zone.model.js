import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

    // 🗺️ Location
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },

    // Assets in this zone
    tanks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tank" }],
    pipelines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pipeline" }],
    sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sensor" }],

    // Safety & Risk
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
  },
  { timestamps: true }
);

ZoneSchema.index({ location: "2dsphere" });

export default mongoose.model("Zone", ZoneSchema);
