export async function translateText(text: string, target: string) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  console.log("BACKEND_URL:", BACKEND_URL);
  console.log("Sending request:", { text, target });

  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, target }),
  });

  const data = await res.json();

  console.log("Response status:", res.status);
  console.log("Response data:", data);

  if (!res.ok) {
    throw new Error("Translation failed");
  }

  return data.translatedText;
}