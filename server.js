// Load environment variables from .env
import 'dotenv/config';
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Get secret key from environment variables
const SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;

if (!SECRET_KEY) {
    console.error("ERROR: CLOUDFLARE_SECRET_KEY is not set in .env");
}

// Basic GET route so "/" doesn't give "Cannot GET /"
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// POST /verify route for Cloudflare Turnstile
app.post("/verify", async (req, res) => {
    const { token } = req.body;

    if (!SECRET_KEY) {
        return res.status(500).json({ success: false, error: "Secret key not set" });
    }

    try {
        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${SECRET_KEY}&response=${token}`
            }
        );

        const data = await response.json();
        res.json({ success: data.success });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Use Vercel dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));