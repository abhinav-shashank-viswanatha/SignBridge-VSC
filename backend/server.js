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
    libretranslateConfigured: false,
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

    console.log("MyMemory raw response:", mmResponse.data);

    const translated = mmResponse.data?.responseData?.translatedText || "";

    if (!translated) {
      return res.status(502).json({
        error: "Translation provider returned no translated text",
        details: mmResponse.data,
      });
    }

    return res.json({
      translatedText: translated,
    });
  } catch (error) {
    console.error(
      "MyMemory failed:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "Translation failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});