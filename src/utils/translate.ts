app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({ error: "Missing text or target" });
    }

    console.log("Incoming:", text, target);

    const response = await axios.post(
      "https://libretranslate.de/translate",
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

    console.log("API RESPONSE:", response.data);

    res.json({
      translatedText: response.data.translatedText
    });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Translation failed",
      details: error.response?.data || error.message
    });
  }
});