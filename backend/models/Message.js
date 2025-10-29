const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    context: { type: Object, default: {} },
    response: { type: Object, default: {} },
    rawText: { type: String },
    model: { type: String, default: "gemini-2.0-pro" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
