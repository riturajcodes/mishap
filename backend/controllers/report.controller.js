const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent";

/**
 * @desc Generate AI-based risk report using Gemini
 * @route POST /api/gemini/report
 * @access Private (for logged-in users)
 */
const generateRiskReport = async (req, res) => {
  try {
    const { plantData } = req.body;

    if (!plantData) {
      return res.status(400).json({ error: "Missing plant data" });
    }

    // 🧠 Construct AI prompt
    const prompt = `
You are an industrial safety AI.
Analyze the following oil and chemical plant data to detect potential hazards or risks.
Return a structured JSON array with these fields:
- zoneId
- assetType ("tank" | "pipeline" | "sensor" | "ventilation")
- assetId
- riskType
- riskLevel ("Low" | "Medium" | "High")
- cause
- recommendation

Example output:
[
  {
    "zoneId": "Z1",
    "assetType": "tank",
    "assetId": "T1",
    "riskType": "Overpressure",
    "riskLevel": "High",
    "cause": "Pressure 25% above threshold",
    "recommendation": "Inspect relief valve immediately"
  }
]

Analyze the following data and respond ONLY in JSON:

${JSON.stringify(plantData, null, 2)}
`;

    // 🛰️ Build request payload
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    // 🔗 Send request to Gemini API using Axios
    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 🧩 Extract AI response text
    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // 🧾 Try parsing JSON output
    let parsedResult;
    try {
      parsedResult = JSON.parse(aiText);
    } catch (err) {
      parsedResult = {
        rawText: aiText,
        note: "AI output was not valid JSON",
      };
    }

    // ✅ Send structured report
    res.status(200).json({
      message: "Gemini AI Risk Report generated successfully",
      report: parsedResult,
    });
  } catch (error) {
    console.error("❌ Error generating Gemini AI report:", error);
    res.status(500).json({
      message: "Failed to generate Gemini risk report",
      error: error.message,
    });
  }
};

module.exports = { generateRiskReport };
