import express from "express";

const app = express();
app.use(express.json());

// Get secret key from environment variable
const SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;

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
        body: `secret=${SECRET_KEY}&response=${token}`,
      }
    );

    const data = await response.json();
    res.json({ success: data.success });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Use Vercel's dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));