const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Test route
app.get("/", (req, res) => {
  res.send("SignBridge backend working 🚀");
});

// Translation route
app.post("/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    const response = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source: "auto",
        target: targetLang,
        format: "text"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    res.json({ translatedText: response.data.translatedText });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});