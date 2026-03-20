export async function handleHealth(ctx: any): Promise<Response> {
  const { env, origin } = ctx;
  
  try {
    await env.KV.get('test');
    return ctx.jsonResponse({ 
      status: 'ok', 
      timestamp: Date.now(),
      database: 'connected'
    }, 200, origin);
  } catch (error) {
    return ctx.jsonResponse({ 
      status: 'error', 
      timestamp: Date.now(),
      database: 'disconnected'
    }, 500, origin);
  }
}
