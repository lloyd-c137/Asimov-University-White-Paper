import { KV_KEYS, kvGet, kvPut, kvDelete } from '../index';

export async function handleEmails(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/emails/send') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.toEmail || !body?.subject || !body?.body) {
      return ctx.errorResponse('Missing required fields', 'toEmail, subject, and body are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();
    const email = {
      id,
      toEmail: body.toEmail,
      toName: body.toName || '',
      fromEmail: body.fromEmail || 'admissions@asimov.edu',
      fromName: body.fromName || 'Asimov University',
      subject: body.subject,
      body: body.body,
      isRead: false,
      createdAt,
      folder: 'inbox',
    };

    await kvPut(env.KV, KV_KEYS.EMAIL(id), email);
    
    const inboxList = await kvGet<string[]>(env.KV, KV_KEYS.EMAILS_INBOX(body.toEmail)) || [];
    inboxList.unshift(id);
    await kvPut(env.KV, KV_KEYS.EMAILS_INBOX(body.toEmail), inboxList);

    return ctx.jsonResponse({ success: true, email }, 201, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/emails\/inbox\/[^/]+$/)) {
    const email = decodeURIComponent(url.pathname.split('/')[4]);
    const inboxList = await kvGet<string[]>(env.KV, KV_KEYS.EMAILS_INBOX(email)) || [];
    const emails = await Promise.all(
      inboxList.map(id => kvGet<any>(env.KV, KV_KEYS.EMAIL(id)))
    );

    return ctx.jsonResponse({
      emails: emails.filter(e => e !== null).sort((a, b) => b.createdAt - a.createdAt),
    }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/emails\/[^/]+\/read$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    const email = await kvGet<any>(env.KV, KV_KEYS.EMAIL(id));
    if (email) {
      email.isRead = body?.isRead ?? true;
      await kvPut(env.KV, KV_KEYS.EMAIL(id), email);
    }

    return ctx.jsonResponse({ success: true, message: 'Email read status updated' }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/emails\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];

    const email = await kvGet<any>(env.KV, KV_KEYS.EMAIL(id));
    if (!email) {
      return ctx.errorResponse('Email not found', 'No email found with this ID', 404, origin);
    }

    await kvDelete(env.KV, KV_KEYS.EMAIL(id));
    
    const inboxList = await kvGet<string[]>(env.KV, KV_KEYS.EMAILS_INBOX(email.toEmail)) || [];
    const updatedList = inboxList.filter(eid => eid !== id);
    await kvPut(env.KV, KV_KEYS.EMAILS_INBOX(email.toEmail), updatedList);

    return ctx.jsonResponse({ success: true, message: 'Email deleted successfully' }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Email endpoint not found', 404, origin);
}
