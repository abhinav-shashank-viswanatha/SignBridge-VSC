export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!BACKEND_URL) {
    throw new Error("Backend URL not configured");
  }

  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, source, target }),
  });

  const data = await res.json();

  console.log("BACKEND_URL:", BACKEND_URL);
  console.log("Sending request:", { text, source, target });
  console.log("Response status:", res.status);
  console.log("Response data:", data);

  if (!res.ok) {
    throw new Error(data?.error || "Translation failed");
  }

  if (!data?.translatedText) {
    throw new Error("No translated text returned");
  }

  return data.translatedText;
}