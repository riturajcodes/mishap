const mongoose = require("mongoose");

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
    line: { type: mongoose.Schema.Types.ObjectId, ref: "Line" }, // 🔄 changed from pipeline → line

    status: {
      type: String,
      enum: ["Active", "Inactive", "Faulty"],
      default: "Active",
    },
    batteryLevel: Number,
    signalStrength: Number,
    calibrationDate: Date,
    anomalyScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sensor", SensorSchema);
