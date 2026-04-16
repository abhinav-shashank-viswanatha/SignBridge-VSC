<<<<<<< HEAD
export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  console.log("BACKEND_URL:", BACKEND_URL);
  console.log("Sending:", { text, source, target });

  if (!BACKEND_URL) {
    throw new Error("Backend URL not configured");
=======
export async function translateText(text: string, source: string, target: string) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is not configured");
>>>>>>> d2957763e7f80fcbe11e47324d4f5855516cf907
  }

  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
<<<<<<< HEAD
    body: JSON.stringify({
      text,
      source,
      target,
    }),
=======
    body: JSON.stringify({ text, source, target }),
>>>>>>> d2957763e7f80fcbe11e47324d4f5855516cf907
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    throw new Error(`Backend returned non-JSON response (${res.status})`);
  }

  if (!res.ok) {
<<<<<<< HEAD
    throw new Error(data?.error || "Translation failed");
  }

  if (!data?.translatedText) {
    throw new Error("No translated text returned from API");
=======
    const details =
      data?.details
        ? ` | details: ${JSON.stringify(data.details)}`
        : "";

    throw new Error((data?.error || `Translation failed (${res.status})`) + details);
  }

  if (!data?.translatedText || typeof data.translatedText !== "string") {
    throw new Error("No translated text returned");
>>>>>>> d2957763e7f80fcbe11e47324d4f5855516cf907
  }

  return data.translatedText;
}