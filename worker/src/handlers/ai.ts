import { KV_KEYS, kvGet } from '../index';

const LYRA_SOUL_URL = 'https://raw.githubusercontent.com/lloyd-c137/Asimov-University-White-Paper/main/Data/Lyra-soul.md';

async function getLyraSoulContent(): Promise<string> {
  try {
    const response = await fetch(LYRA_SOUL_URL);
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.error('Failed to fetch Lyra-soul.md:', error);
  }
  return `You are Lyra, the AI Admissions Counselor at Asimov University. You guide prospective students through the application process with wisdom, empathy, and insight. Your role is to understand each applicant's unique journey and help them articulate their aspirations.`;
}

export async function handleAI(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/ai/chat') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.messages || !Array.isArray(body.messages)) {
      return ctx.errorResponse('Missing required fields', 'Messages array is required', 400, origin);
    }

    const apiUrl = env.AI_API_URL;
    const apiKey = env.AI_API_KEY;
    const model = env.AI_MODEL;

    if (!apiUrl || !apiKey || !model) {
      return ctx.errorResponse('Server configuration error', 'AI API not configured', 500, origin);
    }

    const lyraSoulContent = await getLyraSoulContent();

    const systemMessage = {
      role: 'system',
      content: lyraSoulContent,
    };

    const allMessages = [systemMessage, ...body.messages];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: allMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return ctx.errorResponse('AI API error', errorData.error?.message || `API error: ${response.status}`, response.status, origin);
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body?.getReader();

    if (!reader) {
      return ctx.errorResponse('Stream error', 'Failed to get response stream', 500, origin);
    }

    ctx.request.signal.addEventListener('abort', () => {
      writer.close();
    });

    (async () => {
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine === '' || trimmedLine === 'data: [DONE]') {
              continue;
            }

            if (trimmedLine.startsWith('data: ')) {
              try {
                const jsonStr = trimmedLine.slice(6);
                const data = JSON.parse(jsonStr);

                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                continue;
              }
            }
          }
        }

        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Stream error:', error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...ctx.corsHeaders(origin),
      },
    });
  }

  return ctx.errorResponse('Not Found', 'AI endpoint not found', 404, origin);
}
