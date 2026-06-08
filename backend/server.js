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
  res.json({
    status: "ok",
    translator: "google",
  });
});

app.post("/translate", async (req, res) => {
  try {
    const { text, source, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({
        error: "Missing text or target language",
      });
    }

    console.log("Incoming request:", {
      text,
      source,
      target,
    });

    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: source || "auto",
          tl: target,
          dt: "t",
          q: text,
        },
        timeout: 10000,
      }
    );

    const translatedText = response.data[0]
      .map((part) => part[0])
      .join("");

    console.log("Translation success:", translatedText);

    return res.json({
      translatedText,
      provider: "google",
    });
  } catch (error) {
    console.error("Translation error:", error.message);

    return res.status(500).json({
      error: "Translation failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`SignBridge backend running on port ${PORT}`);
});