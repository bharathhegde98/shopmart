// shopmart-backend/server.js

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection error:", err.message);
    } else {
        console.log("✅ Connected to MySQL database.");
    }
});

// Test route
app.get("/", (req, res) => {
    res.json({ message: "ShopMart Backend API" });
});

// Register route
app.post("/api/register", async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (first_name, last_name, email, mobile, password) VALUES (?, ?, ?, ?, ?)";
        const values = [firstName, lastName, email, mobile, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("MySQL Query Error:", err);
                if (err.code === "ER_DUP_ENTRY") {
                    return res
                        .status(409)
                        .json({ message: "Email already registered." });
                }
                return res
                    .status(500)
                    .json({ message: "Database error", error: err.message });
            }

            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (hashError) {
        console.error("Hashing Error:", hashError);
        return res
            .status(500)
            .json({ message: "Server error during registration." });
    }
});

// ==========================================================
// THIS IS THE NEW/MISSING LOGIN ROUTE
// ==========================================================
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database Error on Login:", err);
            return res
                .status(500)
                .json({ message: "Database error during login." });
        }

        // Check if a user with that email was found
        if (results.length === 0) {
            // Use a generic error for security to prevent email enumeration
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];

        // Compare the submitted password with the hashed password from the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Passwords do not match
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // SUCCESS! Passwords match.
        // Send back user data but NEVER send the password, even the hash.
        res.status(200).json({
            message: "Login successful!",
            user: {
                id: user.id,
                firstName: user.first_name, // Use the column name from your DB
                lastName: user.last_name, // Use the column name from your DB
                email: user.email,
                mobile: user.mobile,
            },
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
