const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

app.get("/", (req, res) => {
  res.send("SignBridge backend working 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    deeplConfigured: Boolean(DEEPL_API_KEY),
  });
});

function mapToDeepLLang(code) {
  const map = {
    en: "EN",
    es: "ES",
    fr: "FR",
    de: "DE",
    hi: "EN", // fallback, DeepL does not support Hindi text translation
    ar: "EN", // fallback
    pt: "PT-PT",
    ru: "RU",
    ja: "JA",
    ko: "KO",
    it: "IT",
    nl: "NL",
    tr: "EN", // fallback
    zh: "ZH",
    id: "EN", // fallback
  };

  return map[code?.toLowerCase()] || "EN";
}

app.post("/translate", async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !source || !target) {
    return res.status(400).json({
      error: "Missing text, source, or target",
    });
  }

  if (source === target) {
    return res.status(400).json({
      error: "Please select two different languages",
    });
  }

  if (!DEEPL_API_KEY) {
    return res.status(500).json({
      error: "DeepL API key is missing on the backend",
    });
  }

  console.log("Incoming request:", { text, source, target });

  try {
    const sourceLang = mapToDeepLLang(source);
    const targetLang = mapToDeepLLang(target);

    if (sourceLang === targetLang) {
      return res.status(400).json({
        error: "Selected language pair is not supported by DeepL",
      });
    }

    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      {
        text: [text],
        source_lang: sourceLang,
        target_lang: targetLang,
      },
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const translatedText = response.data?.translations?.[0]?.text;

    if (!translatedText) {
      return res.status(502).json({
        error: "No translated text returned from DeepL",
        details: response.data,
      });
    }

    return res.json({ translatedText });
  } catch (error) {
    console.error("DeepL failed:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Translation failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});