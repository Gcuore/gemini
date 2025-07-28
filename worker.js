addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (request.method !== 'POST') {
    return new Response("Solo POST permessi", {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const { text } = await request.json();

    if (!text) {
      return new Response("Campo 'text' mancante", {
        status: 400,
        headers: corsHeaders
      });
    }

    const model = "gemini-2.5-flash-preview-0514";
    const API_KEY = "AIzaSyDbhVFWbFH3cGd5ID3MI7TSaYeTdJf67DE";

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }]
        }),
      }
    );

    const result = await geminiRes.json();

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
