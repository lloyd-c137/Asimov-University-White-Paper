import { KV_KEYS, kvGet, kvPut } from '../index';

export async function handleConversations(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/conversations') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.userId) {
      return ctx.errorResponse('Missing userId', 'User ID is required', 400, origin);
    }

    const user = await kvGet<any>(env.KV, KV_KEYS.USER(body.userId));
    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();
    const conversation = {
      id,
      userId: body.userId,
      messages: body.messages || [],
      createdAt,
      updatedAt: createdAt,
    };

    await kvPut(env.KV, KV_KEYS.CONVERSATION(id), conversation);
    
    const userConversations = await kvGet<string[]>(env.KV, KV_KEYS.CONVERSATIONS_BY_USER(body.userId)) || [];
    userConversations.unshift(id);
    await kvPut(env.KV, KV_KEYS.CONVERSATIONS_BY_USER(body.userId), userConversations);

    return ctx.jsonResponse({ success: true, conversation }, 201, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/conversations\/[^/]+$/)) {
    const userId = url.pathname.split('/')[3];
    const conversationIds = await kvGet<string[]>(env.KV, KV_KEYS.CONVERSATIONS_BY_USER(userId)) || [];
    const conversations = await Promise.all(
      conversationIds.map(id => kvGet<any>(env.KV, KV_KEYS.CONVERSATION(id)))
    );

    return ctx.jsonResponse({
      conversations: conversations.filter(c => c !== null).sort((a, b) => b.updatedAt - a.updatedAt),
    }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/conversations\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    const conversation = await kvGet<any>(env.KV, KV_KEYS.CONVERSATION(id));
    if (!conversation) {
      return ctx.errorResponse('Conversation not found', 'No conversation found with this ID', 404, origin);
    }

    conversation.messages = body.messages;
    conversation.updatedAt = Date.now();
    await kvPut(env.KV, KV_KEYS.CONVERSATION(id), conversation);

    return ctx.jsonResponse({ success: true, message: 'Conversation updated' }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Conversation endpoint not found', 404, origin);
}
