import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Get secret key from environment variable
const SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;

app.post("/verify", async (req, res) => {
    const { token } = req.body;

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
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));