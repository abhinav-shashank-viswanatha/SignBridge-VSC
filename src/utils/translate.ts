const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function translateText(text: string, target: string) {
  const res = await fetch(`${BACKEND_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      text, 
      targetLang: target   
    }),
  });

  const data = await res.json();
  return data.translatedText;
}