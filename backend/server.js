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
    // Provider 1: Argos OpenTech
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
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});