export async function handleApplications(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/applications/submit') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.name || !body?.email) {
      return ctx.errorResponse('Missing required fields', 'Name and email are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const submittedAt = body.submittedAt || Date.now();

    await env.DB.prepare(
      `INSERT INTO applications 
       (id, user_id, name, region, email, language, messages, display_messages, final_response, lyra_evaluation_report, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        body.userId || null,
        body.name,
        body.region || '',
        body.email,
        body.language || 'en',
        JSON.stringify(body.messages || []),
        JSON.stringify(body.displayMessages || []),
        body.finalResponse || '',
        body.lyraEvaluationReport || '',
        'pending',
        submittedAt
      )
      .run();

    if (body.userId) {
      await env.DB.prepare('UPDATE users SET status = ? WHERE id = ?').bind('pending', body.userId).run();
    }

    return ctx.jsonResponse({
      success: true,
      application: {
        id,
        userId: body.userId,
        name: body.name,
        region: body.region,
        email: body.email,
        language: body.language,
        status: 'pending',
        submittedAt,
      },
    }, 201, origin);
  }

  return ctx.errorResponse('Not Found', 'Application endpoint not found', 404, origin);
}
