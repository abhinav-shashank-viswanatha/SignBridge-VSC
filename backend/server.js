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

app.post("/translate", async (req, res) => {
  try {
    const { text, source, target } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Missing text",
      });
    }

    console.log(
      `Translation request: "${text}" (${source} -> ${target})`
    );

    // ==========================
    // LIBRETRANSLATE ATTEMPT
    // ==========================
    try {
      const libreResponse = await axios.post(
        "https://translate.terraprint.co/translate",
        {
          q: text,
          source: source || "auto",
          target,
          format: "text",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (
        libreResponse.data &&
        libreResponse.data.translatedText
      ) {
        console.log("LibreTranslate Success");

        return res.json({
          translatedText:
            libreResponse.data.translatedText,
          provider: "libretranslate",
        });
      }
    } catch (libreError) {
      console.error(
        "LibreTranslate failed:",
        libreError.message
      );
    }

    // ==========================
    // GOOGLE FALLBACK
    // ==========================
    const googleResponse = await axios.get(
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

    const translatedText = googleResponse.data[0]
      .map((item) => item[0])
      .join("");

    console.log(
      "Google Fallback Success:",
      translatedText
    );

    return res.json({
      translatedText,
      provider: "google",
    });
  } catch (error) {
    console.error("TRANSLATION ERROR:");
    console.error(error);

    return res.status(500).json({
      error: "Translation failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `SignBridge backend running on port ${PORT}`
  );
});