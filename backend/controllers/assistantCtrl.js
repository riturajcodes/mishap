const axios = require("axios");
// Assuming these models are defined and imported correctly:
const Zone = require("../models/Zone.model");
const Line = require("../models/Line.model");
const Tank = require("../models/Tank.model");
const Sensor = require("../models/Sensor.model");
const Message = require("../models/Message");

// Configuration
const MODEL_NAME = "gemini-2.5-flash"; // Explicitly defined for clarity and database saving
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;


// Utility function for exponential backoff retry logic
const callGeminiWithRetry = async (url, body, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429 && i < retries - 1) {
        // Handle rate limiting (429) - wait and retry
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, ...
        console.warn(`⚠️ Rate limit hit. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else if (error.response && error.response.status === 404) {
        // Handle Not Found explicitly for clarity (often model/path issue)
        console.error("❌ API Call Failed (404 Not Found): Check Model Name and Path.");
        throw new Error(`Gemini API call failed: 404 Not Found. Details: ${error.response.data.error.message || 'Unknown error.'}`);
      } else {
        // Re-throw other errors (5xx, other 4xx)
        throw error;
      }
    }
  }
  throw new Error("Gemini API call failed after multiple retries due to rate limiting or connection issues.");
};


module.exports = {
  // 💬 Main chat handler
  handleAIChat: async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ msg: "Missing prompt" });

      // 1. --- Data Aggregation Logic (Always Run) ---
      const zones = await Zone.find().lean();
      const allZones = [];

      for (let zone of zones) {
        const lines = await Line.find({ zone: zone._id }).lean();
        const tanks = await Tank.find({ zone: zone._id }).lean();

        // Helper function for asset data
        const summarizeAssets = async (assets, assetType) => {
          return await Promise.all(assets.map(async (asset) => {
            // Filter sensors based on asset type
            const filter = assetType === 'line' ? { line: asset._id } : { tank: asset._id };
            const sensors = await Sensor.find(filter).lean();
            return {
              name: asset.name,
              ...(assetType === 'line' ? { riskLevel: asset.riskLevel } : { capacity: asset.capacity }),
              totalSensors: sensors.length,
              activeSensors: sensors.filter(s => s.status === "Active").length,
              faultySensors: sensors.filter(s => s.status === "Faulty").length,
            };
          }));
        };

        const summarizedLines = await summarizeAssets(lines, 'line');
        const summarizedTanks = await summarizeAssets(tanks, 'tank');
        // -----------------------------

        allZones.push({
          name: zone.name,
          location: zone.location,
          lines: summarizedLines,
          tanks: summarizedTanks,
        });
      }

      const plantDataJSON = JSON.stringify(allZones, null, 2);

      // 2. --- Construct the System Prompt ---
      // This prompt structure is sent every time, providing the full plant context.
      const systemPromptText = `
You are an industrial safety AI assistant for an oil and chemical plant.
You analyze summarized plant data, detect risks, and provide safety, maintenance, and operational insights.

Here is the summarized current plant data. Use this data as your ONLY context:
${plantDataJSON}

Now, respond concisely and relevantly to this new user message:
"${prompt}"
`;

      // 3. 🌐 Send to Gemini using the retry utility
      const requestBody = {
        // Send the entire instruction block as the main content for the model to process
        contents: [{ parts: [{ text: systemPromptText }] }],
      };

      const fullApiUrl = `${API_URL}?key=${GEMINI_API_KEY}`;

      const response = await callGeminiWithRetry(fullApiUrl, requestBody);

      // --- Response Parsing ---
      const aiText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      let parsedResult;
      try {
        // Attempt to parse JSON if the AI decided to output structured data
        parsedResult = JSON.parse(aiText);
        // Ensure the parsed result is an object before saving, otherwise stick to text
        if (typeof parsedResult !== 'object' || parsedResult === null) {
          throw new Error("Parsed result was not a valid object, treating as plain text.");
        }
      } catch (e) {
        // Fallback to plain text structure
        parsedResult = { text: aiText };
      }
      // ------------------------

      // 4. 💾 Save message (using the single-object save structure from your previous file)
      // Note: Since history is ignored, the 'context' field is empty/default.
      await Message.create({
        prompt,
        // The context field will be an empty object here as we are not relying on chat history.
        response: parsedResult,
        rawText: aiText,
        model: MODEL_NAME,
      });

      res.status(200).json({
        message: "AI response generated successfully",
        response: parsedResult,
      });
    } catch (error) {
      console.error("❌ Fatal Error in AI chat:", error.message);
      res.status(500).json({
        message: "AI chat failed",
        error: error.message,
      });
    }
  },

  // 🔹 Fetch previous messages endpoint (unchanged, needed for UI display)
  fetchMessages: async (req, res) => {
    try {
      const messages = await Message.find()
        .sort({ createdAt: 1 })
        .select("-__v");

      res.status(200).json({
        message: "Fetched previous messages successfully",
        data: messages,
      });
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      res.status(500).json({
        message: "Failed to fetch previous messages",
        error: error.message,
      });
    }
  },
};
