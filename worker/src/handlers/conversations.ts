export async function handleConversations(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/conversations') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.userId) {
      return ctx.errorResponse('Missing userId', 'User ID is required', 400, origin);
    }

    const user = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(body.userId).first();
    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();

    await env.DB.prepare(
      'INSERT INTO conversations (id, user_id, messages, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(id, body.userId, JSON.stringify(body.messages || []), createdAt, createdAt)
      .run();

    return ctx.jsonResponse({
      success: true,
      conversation: {
        id,
        userId: body.userId,
        messages: body.messages || [],
        createdAt,
        updatedAt: createdAt,
      },
    }, 201, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/conversations\/[^/]+$/)) {
    const userId = url.pathname.split('/')[3];

    const result = await env.DB.prepare('SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC')
      .bind(userId)
      .all();

    return ctx.jsonResponse({
      conversations: result.results.map((conv: any) => ({
        id: conv.id,
        userId: conv.user_id,
        messages: JSON.parse(conv.messages),
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
      })),
    }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/conversations\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    const conversation = await env.DB.prepare('SELECT id FROM conversations WHERE id = ?').bind(id).first();
    if (!conversation) {
      return ctx.errorResponse('Conversation not found', 'No conversation found with this ID', 404, origin);
    }

    const updatedAt = Date.now();
    await env.DB.prepare('UPDATE conversations SET messages = ?, updated_at = ? WHERE id = ?')
      .bind(JSON.stringify(body.messages), updatedAt, id)
      .run();

    return ctx.jsonResponse({ success: true, message: 'Conversation updated' }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Conversation endpoint not found', 404, origin);
}
