export async function translateText(text: string, source: string, target: string) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is not configured");
  }

  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, source, target }),
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    throw new Error(`Backend returned non-JSON response (${res.status})`);
  }

  if (!res.ok) {
    const details =
      data?.details
        ? ` | details: ${JSON.stringify(data.details)}`
        : "";

    throw new Error((data?.error || `Translation failed (${res.status})`) + details);
  }

  if (!data?.translatedText || typeof data.translatedText !== "string") {
    throw new Error("No translated text returned");
  }

  return data.translatedText;
}