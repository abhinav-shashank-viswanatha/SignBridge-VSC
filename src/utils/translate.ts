export async function translateText(text: string, source: string, target: string) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, source, target }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Translation failed");
  }

  if (!data?.translatedText || typeof data.translatedText !== "string") {
    throw new Error("No translated text returned");
  }

  return data.translatedText;
}