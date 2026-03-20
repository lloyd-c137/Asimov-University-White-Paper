export async function handleEmails(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/emails/send') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.toEmail || !body?.subject || !body?.body) {
      return ctx.errorResponse('Missing required fields', 'toEmail, subject, and body are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();

    await env.DB.prepare(
      `INSERT INTO emails (id, to_email, to_name, from_email, from_name, subject, body, is_read, created_at, folder)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'inbox')`
    )
      .bind(
        id,
        body.toEmail,
        body.toName || '',
        body.fromEmail || 'admissions@asimov.edu',
        body.fromName || 'Asimov University',
        body.subject,
        body.body,
        createdAt
      )
      .run();

    return ctx.jsonResponse({
      success: true,
      email: {
        id,
        toEmail: body.toEmail,
        toName: body.toName,
        fromEmail: body.fromEmail || 'admissions@asimov.edu',
        fromName: body.fromName || 'Asimov University',
        subject: body.subject,
        body: body.body,
        isRead: false,
        createdAt,
        folder: 'inbox',
      },
    }, 201, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/emails\/inbox\/[^/]+$/)) {
    const email = decodeURIComponent(url.pathname.split('/')[4]);

    const result = await env.DB.prepare('SELECT * FROM emails WHERE to_email = ? AND folder = ? ORDER BY created_at DESC')
      .bind(email, 'inbox')
      .all();

    return ctx.jsonResponse({
      emails: result.results.map((e: any) => ({
        id: e.id,
        toEmail: e.to_email,
        toName: e.to_name,
        fromEmail: e.from_email,
        fromName: e.from_name,
        subject: e.subject,
        body: e.body,
        isRead: e.is_read === 1,
        createdAt: e.created_at,
        folder: e.folder,
      })),
    }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/emails\/[^/]+\/read$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    await env.DB.prepare('UPDATE emails SET is_read = ? WHERE id = ?')
      .bind(body?.isRead ? 1 : 0, id)
      .run();

    return ctx.jsonResponse({ success: true, message: 'Email read status updated' }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/emails\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];

    const email = await env.DB.prepare('SELECT id FROM emails WHERE id = ?').bind(id).first();
    if (!email) {
      return ctx.errorResponse('Email not found', 'No email found with this ID', 404, origin);
    }

    await env.DB.prepare('DELETE FROM emails WHERE id = ?').bind(id).run();

    return ctx.jsonResponse({ success: true, message: 'Email deleted successfully' }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Email endpoint not found', 404, origin);
}
