require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// List of allowed origins
const isProduction = process.env.NODE_ENV === "production";

// List of allowed origins
const allowedOrigins = isProduction
    ? ["https://mishap.onrender.com"]
    : [
        "http://localhost:3000",
    ];

// Middleware for logging all incoming requests
app.use((req, res, next) => {
    console.log(`[${req.ip}] ${req.method} request to ${req.url}`);
    next();
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(function (req, res, next) {
    const origin = req.headers.origin;

    // Check if the origin is in the allowed origins list
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin); // Allow only valid origin
    }

    res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies to be sent with requests
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    ); // Allow custom headers
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH"); // Allow specific methods

    // Handle preflight requests (OPTIONS)
    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Respond with a 200 for preflight
    }

    next(); // Proceed to the next middleware or route handler
});

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

// Routes
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/zoneRouter"));
app.use("/api", require("./routes/assistantRouter"));


// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("💾 MongoDB Connected");
        app.listen(process.env.PORT, () => {
            console.log(`🖥️ @ http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});