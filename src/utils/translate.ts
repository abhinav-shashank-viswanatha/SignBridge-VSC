export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

<<<<<<< HEAD
  console.log("=================================");
  console.log("TRANSLATE REQUEST");
  console.log("BACKEND_URL:", BACKEND_URL);
  console.log("TEXT:", text);
  console.log("SOURCE:", source);
  console.log("TARGET:", target);
  console.log("=================================");
=======
  console.log("BACKEND_URL:", BACKEND_URL);
  console.log("Sending request:", { text, source, target });
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a

  if (!BACKEND_URL) {
    throw new Error("Backend URL not configured");
  }

<<<<<<< HEAD
  const endpoint = `${BACKEND_URL}/translate`;

  console.log("Calling:", endpoint);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        source,
        target,
      }),
    });

    console.log("Response Status:", res.status);

    const data = await res.json();

    console.log("Response Data:", data);

    if (!res.ok) {
      throw new Error(data?.error || "Translation failed");
    }

    if (
      !data ||
      typeof data.translatedText !== "string" ||
      !data.translatedText.trim()
    ) {
      throw new Error("No translated text returned");
    }

    return data.translatedText;
  } catch (error) {
    console.error("TRANSLATION ERROR:", error);
    throw error;
  }
=======
  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, source, target }),
  });

  const data = await res.json();

  console.log("Response status:", res.status);
  console.log("Response data:", data);

  if (!res.ok) {
    throw new Error(data?.error || "Translation failed");
  }

  if (!data?.translatedText || typeof data.translatedText !== "string") {
    throw new Error("No translated text returned");
  }

  return data.translatedText;
>>>>>>> 727bf14170d488d0ae343329411bb1264258906a
}