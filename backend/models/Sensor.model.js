import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    sensorType: {
      type: String,
      enum: [
        "Temperature",
        "Pressure",
        "GasLeak",
        "Vibration",
        "Flow",
        "Smoke",
        "Humidity",
        "Voltage",
        "Custom",
      ],
      default: "Custom",
    },
    unit: String,
    lastReading: Number,
    lastUpdated: Date,

    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone" },
    tank: { type: mongoose.Schema.Types.ObjectId, ref: "Tank" },
    pipeline: { type: mongoose.Schema.Types.ObjectId, ref: "Pipeline" },

    status: { type: String, enum: ["Active", "Inactive", "Faulty"], default: "Active" },
    batteryLevel: Number,
    signalStrength: Number,
    calibrationDate: Date,
    anomalyScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Sensor", SensorSchema);
