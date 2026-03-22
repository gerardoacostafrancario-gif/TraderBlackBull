export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { imageBase64, mediaType } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType || 'image/png', data: imageBase64 }
            },
            {
              type: 'text',
              text: `Sos un analista de trading experto. Analizá esta captura de pantalla de una operación y proporcioná:

1. **ENTRADA Y SALIDA DEL TRADE**
   - Identificá el precio de entrada y salida si son visibles
   - Evaluá si la entrada fue en un punto técnico relevante (soporte, resistencia, ruptura, zona de liquidez, etc.)
   - Evaluá si la salida fue óptima o si hubo oportunidad de mejor gestión

2. **SUGERENCIAS DE MEJORA**
   - Señalá 2 o 3 aspectos concretos y accionables para mejorar la operación
   - Indicá si el timing de entrada/salida pudo ser diferente
   - Comentá sobre gestión del riesgo si hay información visible

Sé directo, concreto y profesional. Respondé en español.`
            }
          ]
        }]
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
