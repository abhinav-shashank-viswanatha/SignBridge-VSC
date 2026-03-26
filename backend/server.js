const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 IMPORTANT: Render requires this
const PORT = process.env.PORT || 5000;


// Test route
app.get("/", (req, res) => {
  res.send("SignBridge backend working 🚀");
});


// Translation route
app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;

    console.log("Incoming request:", text, target);

    const response = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source: "auto",
        target: target,
        format: "text"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    console.log("Translation success:", response.data);

    res.json({
      translatedText: response.data.translatedText
    });

  } catch (error) {
    console.error("TRANSLATION ERROR:", error.message);
    res.status(500).json({ error: "Translation failed" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});