const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "https://libretranslate.com";
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || "";
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || "";

app.get("/", (req, res) => {
  res.send("SignBridge backend working 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    libretranslateConfigured: Boolean(LIBRETRANSLATE_URL),
    myMemoryEmailConfigured: Boolean(MYMEMORY_EMAIL),
  });
});

app.post("/translate", async (req, res) => {
  const { text, source, target } = req.body;

<<<<<<< HEAD
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

  console.log("Incoming request:", { text, source, target });
=======
  if (
    !text ||
    typeof text !== "string" ||
    !source ||
    typeof source !== "string" ||
    !target ||
    typeof target !== "string"
  ) {
    return res.status(400).json({
      error: "Missing or invalid text, source, or target",
    });
  }

  const normalizedText = text.trim();
  const normalizedSource = source.trim().toLowerCase();
  const normalizedTarget = target.trim().toLowerCase();
>>>>>>> d2957763e7f80fcbe11e47324d4f5855516cf907

  if (!normalizedText) {
    return res.status(400).json({
      error: "Text cannot be empty",
    });
  }

  if (normalizedSource === normalizedTarget) {
    return res.status(400).json({
      error: "Source and target languages must be different",
    });
  }

  console.log("Incoming request:", {
    text: normalizedText,
    source: normalizedSource,
    target: normalizedTarget,
  });

  let libreFailure = null;
  let myMemoryFailure = null;

  // Provider 1: LibreTranslate
  try {
<<<<<<< HEAD
    // Provider 1: Argos OpenTech
    const argosResponse = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source,
        target,
        format: "text",
      },
=======
    const payload = {
      q: normalizedText,
      source: normalizedSource,
      target: normalizedTarget,
      format: "text",
    };

    if (LIBRETRANSLATE_API_KEY) {
      payload.api_key = LIBRETRANSLATE_API_KEY;
    }

    const libreResponse = await axios.post(
      `${LIBRETRANSLATE_URL.replace(/\/$/, "")}/translate`,
      payload,
>>>>>>> d2957763e7f80fcbe11e47324d4f5855516cf907
      {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      }
    );

    if (
      libreResponse.data &&
      typeof libreResponse.data.translatedText === "string" &&
      libreResponse.data.translatedText.trim()
    ) {
      console.log("LibreTranslate success:", libreResponse.data.translatedText);
      return res.json({
        translatedText: libreResponse.data.translatedText,
        provider: "libretranslate",
      });
    }

    libreFailure = {
      provider: "libretranslate",
      message: "LibreTranslate returned no translatedText",
      data: libreResponse.data || null,
    };
  } catch (error) {
    libreFailure = {
      provider: "libretranslate",
      message: error.message,
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
  }

  console.error("LibreTranslate failed:", libreFailure);

  // Provider 2: MyMemory
  try {
    const params = {
      q: normalizedText,
      langpair: `${normalizedSource}|${normalizedTarget}`,
    };

    if (MYMEMORY_EMAIL) {
      params.de = MYMEMORY_EMAIL;
    }

    const mmResponse = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params,
        timeout: 20000,
      }
    );

<<<<<<< HEAD
    try {
      // Provider 2: MyMemory fallback
      const mmResponse = await axios.get(
        "https://api.mymemory.translated.net/get",
        {
          params: {
            q: text,
            langpair: `${source}|${target}`,
          },
          timeout: 15000,
        }
      );
=======
    const translated = mmResponse.data?.responseData?.translatedText;
    const responseStatus = mmResponse.data?.responseStatus;
    const responseDetails = mmResponse.data?.responseDetails || "";
>>>>>>> d2957763e7f80fcbe11e47324d4f5855516cf907

    if (
      mmResponse.status === 200 &&
      typeof translated === "string" &&
      translated.trim() &&
      responseStatus !== 429 &&
      !translated.startsWith("MYMEMORY WARNING:")
    ) {
      console.log("MyMemory success:", translated);
      return res.json({
        translatedText: translated,
        provider: "mymemory",
      });
    }

    myMemoryFailure = {
      provider: "mymemory",
      message: "MyMemory returned no usable translated text",
      status: mmResponse.status || null,
      data: mmResponse.data || null,
      responseDetails,
    };
  } catch (error) {
    myMemoryFailure = {
      provider: "mymemory",
      message: error.message,
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
  }

  console.error("MyMemory failed:", myMemoryFailure);

  return res.status(500).json({
    error: "Translation failed",
    details: {
      libretranslate: libreFailure,
      mymemory: myMemoryFailure,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});