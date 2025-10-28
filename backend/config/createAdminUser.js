require("dotenv").config({ path: "../.env" }); // or specify path if needed
const mongoose = require("mongoose");
const User = require("../models/User");


(async () => {
    try {
        console.log("MONGODB_URI:", process.env.MONGODB_URI); // debug check

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        const newUser = new User({
            name: "John Doe",
            email: "johndoe@factory.com",
            password: "pass123",
            phone: "9876543210",
            role: "ADMIN",
        });

        await newUser.save();
        console.log("🎉 User added successfully:", newUser);

    } catch (error) {
        console.error("❌ Error adding user:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
})();
