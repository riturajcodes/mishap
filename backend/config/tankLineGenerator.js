require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const Zone = require("../models/Zone.model");
const Line = require("../models/Line.model");
const Tank = require("../models/Tank.model");
const Sensor = require("../models/Sensor.model");

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Mock reference user
const mockUserId = new mongoose.Types.ObjectId();

const SENSOR_TYPES = [
    "Temperature",
    "Pressure",
    "GasLeak",
    "Vibration",
    "Flow",
    "Smoke",
    "Humidity",
    "Voltage",
];
const LINE_TYPES = ["CrudeOil", "Gas", "Water", "Chemical", "Steam", "Power"];
const TANK_TYPES = ["CrudeOil", "Diesel", "Petrol", "LPG", "Chemical", "Water"];

async function generateSensorsForAsset(assetType, assetId, zoneId) {
    const sensorsToCreate = randomInt(5, 6);
    const sensors = [];

    for (let i = 0; i < sensorsToCreate; i++) {
        // 80% Active, 10% Inactive, 10% Faulty
        const statusRoll = Math.random();
        let status;
        if (statusRoll < 0.8) status = "Active";
        else if (statusRoll < 0.9) status = "Inactive";
        else status = "Faulty";

        // Adjust battery/signal for realism
        let batteryLevel, signalStrength;
        if (status === "Active") {
            batteryLevel = randomInt(75, 100);
            signalStrength = randomInt(70, 100);
        } else if (status === "Inactive") {
            batteryLevel = randomInt(40, 70);
            signalStrength = randomInt(40, 70);
        } else {
            batteryLevel = randomInt(10, 50);
            signalStrength = randomInt(10, 50);
        }

        const sensor = new Sensor({
            owner: mockUserId,
            name: `${assetType}-Sensor-${i + 1}`,
            sensorType: randomFrom(SENSOR_TYPES),
            unit: "Unit",
            lastReading: Math.random() * 100,
            lastUpdated: new Date(),
            zone: zoneId,
            [assetType.toLowerCase()]: assetId,
            status,
            batteryLevel,
            signalStrength,
            anomalyScore: randomInt(0, 30),
        });

        await sensor.save();
        sensors.push(sensor._id);
    }

    return sensors;
}

async function generateForZone(zone) {
    console.log(`🌍 Generating assets for zone: ${zone.name}`);

    // --- Lines ---
    const numLines = randomInt(2, 3);
    for (let i = 0; i < numLines; i++) {
        const line = new Line({
            zone: zone._id,
            name: `${zone.name}-Line-${i + 1}`,
            lineType: randomFrom(LINE_TYPES),
            lengthMeters: randomInt(200, 1000),
            diameterMm: randomInt(200, 1000),
            material: randomFrom(["Steel", "PVC", "Copper", "HDPE"]),
            pressureRating: randomInt(5, 25),
            temperatureRating: randomInt(50, 300),
            corrosionStatus: randomFrom(["Good", "Moderate", "Severe"]),
            riskScore: randomInt(0, 100),
            lastInspection: new Date(Date.now() - randomInt(1, 60) * 86400000),
        });

        await line.save();

        const sensors = await generateSensorsForAsset("Line", line._id, zone._id);
        line.sensors = sensors;
        await line.save();
    }

    // --- Tanks ---
    const numTanks = randomInt(2, 3);
    for (let i = 0; i < numTanks; i++) {
        const tank = new Tank({
            owner: mockUserId,
            zone: zone._id,
            name: `${zone.name}-Tank-${i + 1}`,
            tankType: randomFrom(TANK_TYPES),
            capacityLiters: randomInt(10000, 100000),
            currentLevelLiters: randomInt(1000, 90000),
            material: randomFrom(["Steel", "Fiberglass", "Concrete"]),
            pressureRating: randomInt(5, 25),
            temperatureLimit: randomInt(50, 300),
            corrosionStatus: randomFrom(["Good", "Moderate", "Severe"]),
            riskScore: randomInt(0, 100),
            lastInspection: new Date(Date.now() - randomInt(1, 60) * 86400000),
        });

        await tank.save();

        const sensors = await generateSensorsForAsset("Tank", tank._id, zone._id);
        tank.sensors = sensors;
        await tank.save();
    }
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const zones = await Zone.find({});
        if (!zones.length) {
            console.log("⚠️ No zones found. Please add zones first.");
            process.exit(0);
        }

        for (const zone of zones) {
            await generateForZone(zone);
        }

        console.log("✅ Seeding complete!");
    } catch (err) {
        console.error("❌ Error seeding:", err);
    } finally {
        mongoose.connection.close();
    }
}

seed();
