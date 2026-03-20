export async function handleUsers(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/users/register') {
    const body = await ctx.readBody(ctx.request);
    
    if (!body?.name || !body?.email || !body?.password) {
      return ctx.errorResponse('Missing required fields', 'Name, email, and password are required', 400, origin);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return ctx.errorResponse('Invalid email', 'Please provide a valid email address', 400, origin);
    }

    if (body.password.length < 6) {
      return ctx.errorResponse('Invalid password', 'Password must be at least 6 characters', 400, origin);
    }

    const existingUser = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(body.email).first();
    if (existingUser) {
      return ctx.errorResponse('Email already registered', 'An account with this email already exists', 409, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();

    await env.DB.prepare(
      'INSERT INTO users (id, name, region, email, password, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(id, body.name, body.region || '', body.email, body.password, createdAt, 'in_progress')
      .run();

    return ctx.jsonResponse({
      success: true,
      user: {
        id,
        name: body.name,
        region: body.region || '',
        email: body.email,
        createdAt,
        status: 'in_progress',
      },
    }, 201, origin);
  }

  if (method === 'POST' && url.pathname === '/api/users/login') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.email || !body?.password) {
      return ctx.errorResponse('Missing credentials', 'Email and password are required', 400, origin);
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(body.email).first();

    if (!user || user.password !== body.password) {
      return ctx.errorResponse('Invalid credentials', 'Email or password is incorrect', 401, origin);
    }

    return ctx.jsonResponse({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        region: user.region,
        email: user.email,
        createdAt: user.created_at,
        status: user.status,
      },
    }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/users\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];

    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();

    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    return ctx.jsonResponse({
      user: {
        id: user.id,
        name: user.name,
        region: user.region,
        email: user.email,
        createdAt: user.created_at,
        status: user.status,
      },
    }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/users\/[^/]+\/status$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    if (!['pending', 'approved', 'rejected'].includes(body?.status)) {
      return ctx.errorResponse('Invalid status', 'Status must be pending, approved, or rejected', 400, origin);
    }

    const user = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(id).first();
    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    await env.DB.prepare('UPDATE users SET status = ? WHERE id = ?').bind(body.status, id).run();

    return ctx.jsonResponse({ success: true, message: 'User status updated' }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/users\/status\/[^/]+$/)) {
    const email = decodeURIComponent(url.pathname.split('/')[4]);

    const user = await env.DB.prepare('SELECT id, name, email, status FROM users WHERE email = ?').bind(email).first();

    if (!user) {
      return ctx.jsonResponse({ exists: false, hasApplied: false, status: null }, 200, origin);
    }

    const application = await env.DB.prepare('SELECT id, status FROM applications WHERE email = ?').bind(email).first();

    return ctx.jsonResponse({
      exists: true,
      hasApplied: !!application,
      status: application ? application.status : user.status,
      userId: user.id,
      name: user.name,
    }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'User endpoint not found', 404, origin);
}
