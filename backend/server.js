const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("SignBridge backend working 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({
        error: "Missing text or target"
      });
    }

    console.log("Incoming request:", { text, target });

    const response = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source: "auto",
        target,
        format: "text"
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000
      }
    );

    console.log("Provider response:", response.data);

    if (!response.data || !response.data.translatedText) {
      return res.status(502).json({
        error: "No translatedText returned from provider",
        providerResponse: response.data
      });
    }

    res.json({
      translatedText: response.data.translatedText
    });
  } catch (error) {
    console.error("FULL TRANSLATION ERROR:");
    console.error("message:", error.message);
    console.error("provider data:", error.response?.data);
    console.error("provider status:", error.response?.status);

    res.status(500).json({
      error: "Translation failed",
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});