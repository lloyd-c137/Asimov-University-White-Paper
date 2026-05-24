export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve static assets; fallback to index.html for SPA
    const response = await env.ASSETS.fetch(request);
    if (!response || response.status !== 404) return response;
    
    return env.ASSETS.fetch(new URL("/index.html", request.url));
  }
};
