const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authCtrl = {
    generateAccessToken: async (req, res) => {
        try {
            const refresh_token = req.cookies.refresh_token;
            if (!refresh_token)
                return res.status(400).json({ msg: "Please login now." });

            jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, result) => {
                    if (err) {
                        return res.status(400).json({ msg: "Please login now." });
                    }

                    const user = await User.findById(result.id);

                    if (!user) {
                        return res.status(400).json({ msg: "Something went Wrong!" });
                    }

                    if (user.userStatus == "inactive")
                        return res
                            .status(400)
                            .json({ msg: "Your account is deactivated." });

                    const access_token = createAccessToken({ id: result.id });
                    return res.status(200).json({
                        msg: "Success!",
                        access_token,
                        user: {
                            ...user._doc,
                            password: "",
                        },
                    });
                }
            );
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: "This email is not registered." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Password is incorrect." });
            }


            const access_token = createAccessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });

            const isProduction = process.env.NODE_ENV === "production";

            res.cookie("refresh_token", refresh_token, {
                secure: isProduction, // Ensures HTTPS in production
                maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 30 days
                path: "/", // Available across all paths on the domain
                sameSite: isProduction ? "None" : "Lax", // "None" in production; "Lax" for local development
                domain: isProduction ? "" : undefined, // Set domain only in production
                httpOnly: true, // Prevents client-side JS from accessing the cookie
            });

            return res.status(200).json({
                msg: "Logged In!",
                access_token,
                user: {
                    ...user._doc,
                    password: "",
                },
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: async (req, res) => {
        try {
            // Clear the refresh_token cookie
            const isProduction = process.env.NODE_ENV === "production";

            res.clearCookie("refresh_token", {
                path: "/",
                domain: isProduction ? "" : undefined, // Domain only for production
                secure: isProduction, // Secure only in production
                sameSite: isProduction ? "None" : "Lax", // "None" for cross-origin cookies in production
                httpOnly: true, // Prevents client-side JS access
            });

            // Respond with success
            res
                .status(200)
                .json({ success: true, message: "Logged out successfully." });
        } catch (error) {
            // Handle errors
            console.error("Logout Error:", error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error." });
        }
    },
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = authCtrl;