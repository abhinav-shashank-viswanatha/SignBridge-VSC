const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Render port
const PORT = process.env.PORT || 5000;



// Root route (health check)
app.get("/", (req, res) => {
  res.send("SignBridge backend working 🚀");
});



// Health check route (very useful)
app.get("/health", (req, res) => {
  res.json({ status: "Backend is healthy ✅" });
});



// Translation route
app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;

    // Validate request
    if (!text || !target) {
      return res.status(400).json({
        error: "Missing text or target language"
      });
    }

    console.log("Incoming request:", text, "->", target);

    const response = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source: "auto",
        target: target,
        format: "text"
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000
      }
    );

    // Validate translation response
    if (!response.data || !response.data.translatedText) {
      console.log("Bad response from translation API:", response.data);
      return res.status(500).json({ error: "Bad translation response" });
    }

    console.log("Translation success:", response.data.translatedText);

    res.json({
      translatedText: response.data.translatedText
    });

  } catch (error) {
    console.error("TRANSLATION ERROR FULL:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});