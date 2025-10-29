require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Zone = require("../models/Zone.model");
const RiskAssessment = require("../models/RiskAssesment.model");

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomProb = () => Number((Math.random() * 0.9 + 0.1).toFixed(2)); // 0.1 - 1.0

(async () => {
    try {
        console.log("🔗 Connecting to MongoDB...");
        if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env");

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        const zones = await Zone.find();
        if (!zones.length) {
            console.log("⚠️ No zones found in the database.");
            return;
        }

        const riskTypes = [
            "Leakage",
            "Overpressure",
            "Fire Hazard",
            "Toxic Gas",
            "Corrosion",
            "Equipment Failure",
            "Overheating",
            "Flood Risk",
            "Earthquake Structural Risk",
            "Human Error",
        ];

        const riskLevels = ["Low", "Moderate", "High", "Critical"];
        const sourceTypes = ["Sensor", "Tank", "Line"];

        for (const zone of zones) {
            const riskCount = 3 + Math.floor(Math.random() * 3); // 3–5 per zone

            for (let i = 0; i < riskCount; i++) {
                const riskType = randomChoice(riskTypes);
                const riskLevel = randomChoice(riskLevels);
                const probability = randomProb();
                const sourceType = randomChoice(sourceTypes);

                const aiSuggestion = `AI suggests monitoring for ${riskType.toLowerCase()} due to abnormal readings.`;
                const recommendedAction = `Inspect ${sourceType.toLowerCase()} and follow safety protocols.`;

                const risk = new RiskAssessment({
                    zone: zone._id,
                    sourceType,
                    sourceId: new mongoose.Types.ObjectId(), // dummy ref
                    riskType,
                    riskLevel,
                    probability,
                    aiSuggestion,
                    recommendedAction,
                    status: "Active",
                });

                await risk.save();
                console.log(`✅ Added risk for zone "${zone.name}": ${riskType} (${riskLevel})`);
            }
        }

        console.log("🎉 Risk assessments generated successfully for all zones!");

    } catch (error) {
        console.error("❌ Error generating risk assessments:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
})();
