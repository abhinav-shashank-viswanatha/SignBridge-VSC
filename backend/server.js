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

<<<<<<< HEAD
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
=======
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    libretranslateConfigured: true,
    myMemoryEmailConfigured: false,
  });
});

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

  console.log("Incoming request:", { text, source, target });

  try {
    const argosResponse = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source,
        target,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    if (argosResponse.data?.translatedText) {
      console.log("Argos success:", argosResponse.data.translatedText);
      return res.json({
        translatedText: argosResponse.data.translatedText,
      });
    }

    throw new Error("Argos returned no translatedText");
  } catch (argosError) {
    console.error(
      "Argos failed:",
      argosError.response?.data || argosError.message
    );

    try {
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

      const translated =
        mmResponse.data?.responseData?.translatedText || "";

      if (translated) {
        console.log("MyMemory success:", translated);
        return res.json({
          translatedText: translated,
        });
      }

      return res.status(502).json({
        error: "Both translation providers failed",
        details: mmResponse.data || "No translated text returned",
      });
    } catch (mmError) {
      console.error(
        "MyMemory failed:",
        mmError.response?.data || mmError.message
      );

      return res.status(500).json({
        error: "Translation failed",
        details: {
          argos: argosError.response?.data || argosError.message,
          mymemory: mmError.response?.data || mmError.message,
        },
      });
    }
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a
  }
});

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(
    `SignBridge backend running on port ${PORT}`
  );
=======
  console.log(`Server running on port ${PORT}`);
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a
});