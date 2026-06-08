const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const axios = require("axios"); // Added axios for consistent, reliable request handling
=======
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Fallbacks: Checks if an engine URL environment flag is active, or uses community endpoints
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || "https://lt.it.cx";
const GOOGLE_API_URL = "https://translate.googleapis.com/translate_a/single";

app.post("/translate", async (req, res) => {
  // Destructure source to support your React layout's parameters fully
  const { text, source, target } = req.body;

  const normalizedText = (text || "").trim();
  const normalizedSource = (source || "auto").trim().toLowerCase();
  const normalizedTarget = (target || "es").trim().toLowerCase();

  if (!normalizedText) {
    return res.status(400).json({ error: "Text package cannot be blank" });
  }

  console.log(`Forwarding translation: [${normalizedSource} -> ${normalizedTarget}]: "${normalizedText}"`);

  // ==========================================
  // ENGINE 1: Reliable LibreTranslate Instance
  // ==========================================
  try {
    const libreResponse = await axios.post(
      `${LIBRETRANSLATE_URL.replace(/\/$/, "")}/translate`,
      {
        q: normalizedText,
        source: normalizedSource,
        target: normalizedTarget,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      }
    );

    if (libreResponse.data?.translatedText) {
      console.log("LibreTranslate Mirror Success!");
      return res.json({
        translatedText: libreResponse.data.translatedText,
        provider: "libretranslate",
      });
    }
  } catch (error) {
    console.warn("LibreTranslate mirror failed or timed out. Diverting to Google engine...");
  }

  // ==========================================
  // ENGINE 2: Bulletproof Google Web Proxy
  // ==========================================
  try {
    const googleTargetUrl = `${GOOGLE_API_URL}?client=gtx&sl=${normalizedSource}&tl=${normalizedTarget}&dt=t&q=${encodeURIComponent(normalizedText)}`;
    
    const googleResponse = await axios.get(googleTargetUrl, { timeout: 6000 });

    if (googleResponse.data && googleResponse.data[0]) {
      // Maps matrix array text pieces cleanly for sentences/paragraphs
      const translatedString = googleResponse.data[0]
        .map((phrase) => phrase[0])
        .filter(Boolean)
        .join("");

      if (translatedString.trim()) {
        console.log("Google Translation Pipeline Success!");
        return res.json({
          translatedText: translatedString,
          provider: "google",
        });
      }
    }
  } catch (error) {
    console.error("Emergency translation engines exhausted:", error.message);
  }

  // Fallback string matching your initial structure exactly if everything fails
  res.status(500).json({
    error: "Translation servers are busy",
    translatedText: "Translation failed",
  });
});

app.listen(5000, () => {
  console.log("Frontend helper server running on port 5000 🚀");
});
=======
app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: target,
        format: "text"
      })
    });

    const data = await response.json();

    res.json({ translatedText: data.translatedText });

  } catch (error) {
    res.json({ translatedText: "Translation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a
