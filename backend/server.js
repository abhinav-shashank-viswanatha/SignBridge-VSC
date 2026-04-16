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

  let argosFailure = null;
  let myMemoryFailure = null;

  try {
    const argosResponse = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: normalizedText,
        source: normalizedSource,
        target: normalizedTarget,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    if (
      argosResponse.data &&
      typeof argosResponse.data.translatedText === "string" &&
      argosResponse.data.translatedText.trim()
    ) {
      console.log("Argos success:", argosResponse.data.translatedText);
      return res.json({
        translatedText: argosResponse.data.translatedText,
        provider: "argos",
      });
    }

    argosFailure = {
      provider: "argos",
      message: "Argos returned no translatedText",
      data: argosResponse.data,
    };
  } catch (error) {
    argosFailure = {
      provider: "argos",
      message: error.message,
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
  }

  console.error("Argos failed:", argosFailure);

  try {
    const mmResponse = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: normalizedText,
          langpair: `${normalizedSource}|${normalizedTarget}`,
        },
        timeout: 15000,
      }
    );

    const translated = mmResponse.data?.responseData?.translatedText;

    if (typeof translated === "string" && translated.trim()) {
      console.log("MyMemory success:", translated);
      return res.json({
        translatedText: translated,
        provider: "mymemory",
      });
    }

    myMemoryFailure = {
      provider: "mymemory",
      message: "MyMemory returned no translatedText",
      data: mmResponse.data,
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
      argos: argosFailure,
      mymemory: myMemoryFailure,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});