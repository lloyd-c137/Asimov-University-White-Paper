import { KV_KEYS, kvGet, kvPut, kvDelete, kvGetAll } from '../index';

export async function handleAdmin(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'GET' && url.pathname === '/api/admin/users') {
    const usersList = await kvGet<string[]>(env.KV, KV_KEYS.USERS_LIST) || [];
    const users = await kvGetAll<any>(env.KV, usersList.map(id => KV_KEYS.USER(id)));
    
    const usersWithApplication = await Promise.all(
      users.filter(u => u !== null).map(async (user: any) => {
        const applicationId = await kvGet<string>(env.KV, KV_KEYS.APPLICATIONS_BY_EMAIL(user.email));
        return {
          id: user.id,
          name: user.name,
          region: user.region,
          email: user.email,
          created_at: user.createdAt,
          status: user.status,
          hasApplication: !!applicationId,
        };
      })
    );

    return ctx.jsonResponse({ users: usersWithApplication }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/admin\/users\/[^/]+$/)) {
    const id = url.pathname.split('/')[4];

    const user = await kvGet<any>(env.KV, KV_KEYS.USER(id));
    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    await kvDelete(env.KV, KV_KEYS.USER(id));
    await kvDelete(env.KV, KV_KEYS.USER_BY_EMAIL(user.email));
    
    const usersList = await kvGet<string[]>(env.KV, KV_KEYS.USERS_LIST) || [];
    await kvPut(env.KV, KV_KEYS.USERS_LIST, usersList.filter(uid => uid !== id));

    return ctx.jsonResponse({ success: true, message: 'User deleted successfully' }, 200, origin);
  }

  if (method === 'GET' && url.pathname === '/api/admin/applications') {
    const applicationsList = await kvGet<string[]>(env.KV, KV_KEYS.APPLICATIONS_LIST) || [];
    const applications = await kvGetAll<any>(env.KV, applicationsList.map(id => KV_KEYS.APPLICATION(id)));

    return ctx.jsonResponse({
      applications: applications.filter(a => a !== null).map((app: any) => ({
        id: app.id,
        userId: app.userId,
        name: app.name,
        region: app.region,
        email: app.email,
        language: app.language,
        messages: app.messages,
        displayMessages: app.displayMessages,
        finalResponse: app.finalResponse,
        status: app.status,
        submittedAt: app.submittedAt,
        reviewedAt: app.reviewedAt,
        reviewerNotes: app.reviewerNotes,
      })),
    }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/admin\/applications\/[^/]+$/)) {
    const id = url.pathname.split('/')[4];
    const application = await kvGet<any>(env.KV, KV_KEYS.APPLICATION(id));

    if (!application) {
      return ctx.errorResponse('Application not found', 'No application found with this ID', 404, origin);
    }

    return ctx.jsonResponse({ application }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/admin\/applications\/[^/]+\/status$/)) {
    const id = url.pathname.split('/')[4];
    const body = await ctx.readBody(ctx.request);

    if (!['pending', 'approved', 'rejected', 'conditional'].includes(body?.status)) {
      return ctx.errorResponse('Invalid status', 'Status must be pending, approved, rejected, or conditional', 400, origin);
    }

    const application = await kvGet<any>(env.KV, KV_KEYS.APPLICATION(id));
    if (!application) {
      return ctx.errorResponse('Application not found', 'No application found with this ID', 404, origin);
    }

    application.status = body.status;
    application.reviewerNotes = body.reviewerNotes || null;
    application.reviewedAt = Date.now();
    await kvPut(env.KV, KV_KEYS.APPLICATION(id), application);

    if (application.userId) {
      const user = await kvGet<any>(env.KV, KV_KEYS.USER(application.userId));
      if (user) {
        user.status = body.status;
        await kvPut(env.KV, KV_KEYS.USER(application.userId), user);
      }
    }

    return ctx.jsonResponse({ success: true, message: 'Application status updated' }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/admin\/applications\/[^/]+$/)) {
    const id = url.pathname.split('/')[4];

    const application = await kvGet<any>(env.KV, KV_KEYS.APPLICATION(id));
    if (!application) {
      return ctx.errorResponse('Application not found', 'No application found with this ID', 404, origin);
    }

    await kvDelete(env.KV, KV_KEYS.APPLICATION(id));
    await kvDelete(env.KV, KV_KEYS.APPLICATIONS_BY_EMAIL(application.email));
    
    const applicationsList = await kvGet<string[]>(env.KV, KV_KEYS.APPLICATIONS_LIST) || [];
    await kvPut(env.KV, KV_KEYS.APPLICATIONS_LIST, applicationsList.filter(aid => aid !== id));

    return ctx.jsonResponse({ success: true, message: 'Application deleted successfully' }, 200, origin);
  }

  if (method === 'POST' && url.pathname === '/api/admin/logs') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.action) {
      return ctx.errorResponse('Missing required fields', 'Action is required', 400, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();
    const log = {
      id,
      action: body.action,
      details: body.details || null,
      userEmail: body.userEmail || null,
      targetId: body.targetId || null,
      targetType: body.targetType || null,
      createdAt,
    };

    await kvPut(env.KV, KV_KEYS.ADMIN_LOG(id), log);
    
    const logsList = await kvGet<string[]>(env.KV, KV_KEYS.ADMIN_LOGS_LIST) || [];
    logsList.unshift(id);
    if (logsList.length > 1000) logsList.pop();
    await kvPut(env.KV, KV_KEYS.ADMIN_LOGS_LIST, logsList);

    return ctx.jsonResponse({ success: true, log }, 201, origin);
  }

  if (method === 'GET' && url.pathname === '/api/admin/logs') {
    const action = url.searchParams.get('action');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const logsList = await kvGet<string[]>(env.KV, KV_KEYS.ADMIN_LOGS_LIST) || [];
    let logs = await kvGetAll<any>(env.KV, logsList.slice(0, limit));
    
    logs = logs.filter(l => l !== null);
    if (action) {
      logs = logs.filter((l: any) => l.action === action);
    }

    return ctx.jsonResponse({ logs }, 200, origin);
  }

  if (method === 'GET' && url.pathname === '/api/email-templates') {
    const templatesList = await kvGet<string[]>(env.KV, KV_KEYS.EMAIL_TEMPLATES_LIST) || [];
    const templates = await kvGetAll<any>(env.KV, templatesList.map(id => KV_KEYS.EMAIL_TEMPLATE(id)));

    return ctx.jsonResponse({
      templates: templates.filter(t => t !== null).sort((a, b) => b.createdAt - a.createdAt),
    }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/email-templates\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];
    const template = await kvGet<any>(env.KV, KV_KEYS.EMAIL_TEMPLATE(id));

    if (!template) {
      return ctx.errorResponse('Template not found', 'No email template found with this ID', 404, origin);
    }

    return ctx.jsonResponse({ template }, 200, origin);
  }

  if (method === 'POST' && url.pathname === '/api/email-templates') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.name || !body?.category || !body?.subject || !body?.body) {
      return ctx.errorResponse('Missing required fields', 'Name, category, subject, and body are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();
    const template = {
      id,
      name: body.name,
      category: body.category,
      subject: body.subject,
      body: body.body,
      variables: body.variables || [],
      isActive: body.isActive !== false,
      createdAt,
      updatedAt: createdAt,
    };

    await kvPut(env.KV, KV_KEYS.EMAIL_TEMPLATE(id), template);
    
    const templatesList = await kvGet<string[]>(env.KV, KV_KEYS.EMAIL_TEMPLATES_LIST) || [];
    templatesList.unshift(id);
    await kvPut(env.KV, KV_KEYS.EMAIL_TEMPLATES_LIST, templatesList);

    return ctx.jsonResponse({ success: true, template }, 201, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/email-templates\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    const template = await kvGet<any>(env.KV, KV_KEYS.EMAIL_TEMPLATE(id));
    if (!template) {
      return ctx.errorResponse('Template not found', 'No email template found with this ID', 404, origin);
    }

    template.name = body.name;
    template.category = body.category;
    template.subject = body.subject;
    template.body = body.body;
    template.variables = body.variables || [];
    template.isActive = body.isActive !== false;
    template.updatedAt = Date.now();
    await kvPut(env.KV, KV_KEYS.EMAIL_TEMPLATE(id), template);

    return ctx.jsonResponse({ success: true, message: 'Email template updated' }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/email-templates\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];

    const template = await kvGet<any>(env.KV, KV_KEYS.EMAIL_TEMPLATE(id));
    if (!template) {
      return ctx.errorResponse('Template not found', 'No email template found with this ID', 404, origin);
    }

    await kvDelete(env.KV, KV_KEYS.EMAIL_TEMPLATE(id));
    
    const templatesList = await kvGet<string[]>(env.KV, KV_KEYS.EMAIL_TEMPLATES_LIST) || [];
    await kvPut(env.KV, KV_KEYS.EMAIL_TEMPLATES_LIST, templatesList.filter(tid => tid !== id));

    return ctx.jsonResponse({ success: true, message: 'Email template deleted successfully' }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Admin endpoint not found', 404, origin);
}
