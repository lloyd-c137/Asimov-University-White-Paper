import { KV_KEYS, kvGet, kvPut } from '../index';

export async function handleApplications(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/applications/submit') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.name || !body?.email) {
      return ctx.errorResponse('Missing required fields', 'Name and email are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const submittedAt = body.submittedAt || Date.now();
    const application = {
      id,
      userId: body.userId || null,
      name: body.name,
      region: body.region || '',
      email: body.email,
      language: body.language || 'en',
      messages: body.messages || [],
      displayMessages: body.displayMessages || [],
      finalResponse: body.finalResponse || '',
      lyraEvaluationReport: body.lyraEvaluationReport || '',
      status: 'pending',
      submittedAt,
      reviewedAt: null,
      reviewerNotes: null,
    };

    await kvPut(env.KV, KV_KEYS.APPLICATION(id), application);
    await kvPut(env.KV, KV_KEYS.APPLICATIONS_BY_EMAIL(body.email), id);
    
    const applicationsList = await kvGet<string[]>(env.KV, KV_KEYS.APPLICATIONS_LIST) || [];
    applicationsList.unshift(id);
    await kvPut(env.KV, KV_KEYS.APPLICATIONS_LIST, applicationsList);

    if (body.userId) {
      const user = await kvGet<any>(env.KV, KV_KEYS.USER(body.userId));
      if (user) {
        user.status = 'pending';
        await kvPut(env.KV, KV_KEYS.USER(body.userId), user);
      }
    }

    return ctx.jsonResponse({ success: true, application }, 201, origin);
  }

  return ctx.errorResponse('Not Found', 'Application endpoint not found', 404, origin);
}
