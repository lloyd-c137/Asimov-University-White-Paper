export async function handleAdmin(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'GET' && url.pathname === '/api/admin/users') {
    const result = await env.DB.prepare('SELECT id, name, region, email, created_at, status FROM users ORDER BY created_at DESC').all();

    const usersWithApplication = await Promise.all(
      result.results.map(async (user: any) => {
        const application = await env.DB.prepare('SELECT id FROM applications WHERE user_id = ? OR email = ?')
          .bind(user.id, user.email)
          .first();
        return {
          ...user,
          hasApplication: !!application,
        };
      })
    );

    return ctx.jsonResponse({ users: usersWithApplication }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/admin\/users\/[^/]+$/)) {
    const id = url.pathname.split('/')[4];

    const user = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(id).first();
    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    await env.DB.prepare('DELETE FROM conversations WHERE user_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

    return ctx.jsonResponse({ success: true, message: 'User deleted successfully' }, 200, origin);
  }

  if (method === 'GET' && url.pathname === '/api/admin/applications') {
    const result = await env.DB.prepare('SELECT * FROM applications ORDER BY submitted_at DESC').all();

    return ctx.jsonResponse({
      applications: result.results.map((app: any) => ({
        id: app.id,
        userId: app.user_id,
        name: app.name,
        region: app.region,
        email: app.email,
        language: app.language,
        messages: JSON.parse(app.messages || '[]'),
        displayMessages: JSON.parse(app.display_messages || '[]'),
        finalResponse: app.final_response,
        status: app.status,
        submittedAt: app.submitted_at,
        reviewedAt: app.reviewed_at,
        reviewerNotes: app.reviewer_notes,
      })),
    }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/admin\/applications\/[^/]+$/)) {
    const id = url.pathname.split('/')[4];

    const application = await env.DB.prepare('SELECT * FROM applications WHERE id = ?').bind(id).first();
    if (!application) {
      return ctx.errorResponse('Application not found', 'No application found with this ID', 404, origin);
    }

    return ctx.jsonResponse({
      application: {
        id: application.id,
        userId: application.user_id,
        name: application.name,
        region: application.region,
        email: application.email,
        language: application.language,
        messages: JSON.parse(application.messages || '[]'),
        displayMessages: JSON.parse(application.display_messages || '[]'),
        finalResponse: application.final_response,
        status: application.status,
        submittedAt: application.submitted_at,
        reviewedAt: application.reviewed_at,
        reviewerNotes: application.reviewer_notes,
      },
    }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/admin\/applications\/[^/]+\/status$/)) {
    const id = url.pathname.split('/')[4];
    const body = await ctx.readBody(ctx.request);

    if (!['pending', 'approved', 'rejected', 'conditional'].includes(body?.status)) {
      return ctx.errorResponse('Invalid status', 'Status must be pending, approved, rejected, or conditional', 400, origin);
    }

    const application = await env.DB.prepare('SELECT * FROM applications WHERE id = ?').bind(id).first();
    if (!application) {
      return ctx.errorResponse('Application not found', 'No application found with this ID', 404, origin);
    }

    const reviewedAt = Date.now();
    await env.DB.prepare('UPDATE applications SET status = ?, reviewer_notes = ?, reviewed_at = ? WHERE id = ?')
      .bind(body.status, body.reviewerNotes || null, reviewedAt, id)
      .run();

    if (application.user_id) {
      await env.DB.prepare('UPDATE users SET status = ? WHERE id = ?').bind(body.status, application.user_id).run();
    }

    return ctx.jsonResponse({ success: true, message: 'Application status updated' }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/admin\/applications\/[^/]+$/)) {
    const id = url.pathname.split('/')[4];

    const application = await env.DB.prepare('SELECT id FROM applications WHERE id = ?').bind(id).first();
    if (!application) {
      return ctx.errorResponse('Application not found', 'No application found with this ID', 404, origin);
    }

    await env.DB.prepare('DELETE FROM applications WHERE id = ?').bind(id).run();

    return ctx.jsonResponse({ success: true, message: 'Application deleted successfully' }, 200, origin);
  }

  if (method === 'POST' && url.pathname === '/api/admin/logs') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.action) {
      return ctx.errorResponse('Missing required fields', 'Action is required', 400, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();

    await env.DB.prepare(
      'INSERT INTO admin_logs (id, action, details, user_email, target_id, target_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(id, body.action, body.details || null, body.userEmail || null, body.targetId || null, body.targetType || null, createdAt)
      .run();

    return ctx.jsonResponse({
      success: true,
      log: { id, action: body.action, details: body.details, userEmail: body.userEmail, targetId: body.targetId, targetType: body.targetType, createdAt },
    }, 201, origin);
  }

  if (method === 'GET' && url.pathname === '/api/admin/logs') {
    const action = url.searchParams.get('action');
    const targetType = url.searchParams.get('targetType');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM admin_logs';
    const params: any[] = [];
    const conditions: string[] = [];

    if (action) {
      conditions.push('action = ?');
      params.push(action);
    }
    if (targetType) {
      conditions.push('target_type = ?');
      params.push(targetType);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();

    return ctx.jsonResponse({
      logs: result.results.map((log: any) => ({
        id: log.id,
        action: log.action,
        details: log.details,
        userEmail: log.user_email,
        targetId: log.target_id,
        targetType: log.target_type,
        createdAt: log.created_at,
      })),
    }, 200, origin);
  }

  if (method === 'GET' && url.pathname === '/api/email-templates') {
    const category = url.searchParams.get('category');

    let query = 'SELECT * FROM email_templates';
    const params: any[] = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';

    const result = await env.DB.prepare(query).bind(...params).all();

    return ctx.jsonResponse({
      templates: result.results.map((template: any) => ({
        id: template.id,
        name: template.name,
        category: template.category,
        subject: template.subject,
        body: template.body,
        variables: JSON.parse(template.variables || '[]'),
        isActive: template.is_active === 1,
        createdAt: template.created_at,
        updatedAt: template.updated_at,
      })),
    }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/email-templates\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];

    const template = await env.DB.prepare('SELECT * FROM email_templates WHERE id = ?').bind(id).first();
    if (!template) {
      return ctx.errorResponse('Template not found', 'No email template found with this ID', 404, origin);
    }

    return ctx.jsonResponse({
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
        subject: template.subject,
        body: template.body,
        variables: JSON.parse(template.variables || '[]'),
        isActive: template.is_active === 1,
        createdAt: template.created_at,
        updatedAt: template.updated_at,
      },
    }, 200, origin);
  }

  if (method === 'POST' && url.pathname === '/api/email-templates') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.name || !body?.category || !body?.subject || !body?.body) {
      return ctx.errorResponse('Missing required fields', 'Name, category, subject, and body are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();

    await env.DB.prepare(
      'INSERT INTO email_templates (id, name, category, subject, body, variables, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(id, body.name, body.category, body.subject, body.body, JSON.stringify(body.variables || []), body.isActive !== false ? 1 : 0, createdAt, createdAt)
      .run();

    return ctx.jsonResponse({
      success: true,
      template: {
        id,
        name: body.name,
        category: body.category,
        subject: body.subject,
        body: body.body,
        variables: body.variables || [],
        isActive: body.isActive !== false,
        createdAt,
        updatedAt: createdAt,
      },
    }, 201, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/email-templates\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    const template = await env.DB.prepare('SELECT id FROM email_templates WHERE id = ?').bind(id).first();
    if (!template) {
      return ctx.errorResponse('Template not found', 'No email template found with this ID', 404, origin);
    }

    const updatedAt = Date.now();

    await env.DB.prepare(
      'UPDATE email_templates SET name = ?, category = ?, subject = ?, body = ?, variables = ?, is_active = ?, updated_at = ? WHERE id = ?'
    )
      .bind(
        body.name,
        body.category,
        body.subject,
        body.body,
        JSON.stringify(body.variables || []),
        body.isActive !== false ? 1 : 0,
        updatedAt,
        id
      )
      .run();

    return ctx.jsonResponse({ success: true, message: 'Email template updated' }, 200, origin);
  }

  if (method === 'DELETE' && url.pathname.match(/^\/api\/email-templates\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];

    const template = await env.DB.prepare('SELECT id FROM email_templates WHERE id = ?').bind(id).first();
    if (!template) {
      return ctx.errorResponse('Template not found', 'No email template found with this ID', 404, origin);
    }

    await env.DB.prepare('DELETE FROM email_templates WHERE id = ?').bind(id).run();

    return ctx.jsonResponse({ success: true, message: 'Email template deleted successfully' }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Admin endpoint not found', 404, origin);
}
