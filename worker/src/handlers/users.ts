import { KV_KEYS, kvGet, kvPut, kvDelete } from '../index';

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

    const existingUserId = await kvGet<string>(env.KV, KV_KEYS.USER_BY_EMAIL(body.email));
    if (existingUserId) {
      return ctx.errorResponse('Email already registered', 'An account with this email already exists', 409, origin);
    }

    const id = ctx.generateUUID();
    const createdAt = Date.now();
    const user = {
      id,
      name: body.name,
      region: body.region || '',
      email: body.email,
      password: body.password,
      createdAt,
      status: 'in_progress',
    };

    await kvPut(env.KV, KV_KEYS.USER(id), user);
    await kvPut(env.KV, KV_KEYS.USER_BY_EMAIL(body.email), id);
    
    const usersList = await kvGet<string[]>(env.KV, KV_KEYS.USERS_LIST) || [];
    usersList.unshift(id);
    await kvPut(env.KV, KV_KEYS.USERS_LIST, usersList);

    const { password: _, ...userWithoutPassword } = user;
    return ctx.jsonResponse({ success: true, user: userWithoutPassword }, 201, origin);
  }

  if (method === 'POST' && url.pathname === '/api/users/login') {
    const body = await ctx.readBody(ctx.request);

    if (!body?.email || !body?.password) {
      return ctx.errorResponse('Missing credentials', 'Email and password are required', 400, origin);
    }

    const userId = await kvGet<string>(env.KV, KV_KEYS.USER_BY_EMAIL(body.email));
    if (!userId) {
      return ctx.errorResponse('Invalid credentials', 'Email or password is incorrect', 401, origin);
    }

    const user = await kvGet<any>(env.KV, KV_KEYS.USER(userId));
    if (!user || user.password !== body.password) {
      return ctx.errorResponse('Invalid credentials', 'Email or password is incorrect', 401, origin);
    }

    const { password: _, ...userWithoutPassword } = user;
    return ctx.jsonResponse({ success: true, user: userWithoutPassword }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/users\/[^/]+$/)) {
    const id = url.pathname.split('/')[3];
    const user = await kvGet<any>(env.KV, KV_KEYS.USER(id));

    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    const { password: _, ...userWithoutPassword } = user;
    return ctx.jsonResponse({ user: userWithoutPassword }, 200, origin);
  }

  if (method === 'PUT' && url.pathname.match(/^\/api\/users\/[^/]+\/status$/)) {
    const id = url.pathname.split('/')[3];
    const body = await ctx.readBody(ctx.request);

    if (!['pending', 'approved', 'rejected'].includes(body?.status)) {
      return ctx.errorResponse('Invalid status', 'Status must be pending, approved, or rejected', 400, origin);
    }

    const user = await kvGet<any>(env.KV, KV_KEYS.USER(id));
    if (!user) {
      return ctx.errorResponse('User not found', 'No user found with this ID', 404, origin);
    }

    user.status = body.status;
    await kvPut(env.KV, KV_KEYS.USER(id), user);

    return ctx.jsonResponse({ success: true, message: 'User status updated' }, 200, origin);
  }

  if (method === 'GET' && url.pathname.match(/^\/api\/users\/status\/[^/]+$/)) {
    const email = decodeURIComponent(url.pathname.split('/')[4]);
    const userId = await kvGet<string>(env.KV, KV_KEYS.USER_BY_EMAIL(email));

    if (!userId) {
      return ctx.jsonResponse({ exists: false, hasApplied: false, status: null }, 200, origin);
    }

    const user = await kvGet<any>(env.KV, KV_KEYS.USER(userId));
    const applicationId = await kvGet<string>(env.KV, KV_KEYS.APPLICATIONS_BY_EMAIL(email));

    return ctx.jsonResponse({
      exists: true,
      hasApplied: !!applicationId,
      status: applicationId ? (await kvGet<any>(env.KV, KV_KEYS.APPLICATION(applicationId)))?.status : user?.status,
      userId: user?.id,
      name: user?.name,
    }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'User endpoint not found', 404, origin);
}
