export interface Env {
  KV: KVNamespace;
  AI_API_URL: string;
  AI_API_KEY: string;
  AI_MODEL: string;
  ENVIRONMENT: string;
  FRONTEND_URL: string;
}

import { handleUsers } from './handlers/users';
import { handleConversations } from './handlers/conversations';
import { handleApplications } from './handlers/applications';
import { handleEmails } from './handlers/emails';
import { handleAdmin } from './handlers/admin';
import { handleAI } from './handlers/ai';
import { handleHealth } from './handlers/health';

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
});

function jsonResponse(data: any, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

function errorResponse(error: string, message: string, status = 500, origin: string | null = null) {
  return jsonResponse({ error, message }, status, origin);
}

async function readBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export { generateUUID, jsonResponse, errorResponse, readBody, corsHeaders };

export const KV_KEYS = {
  USER: (id: string) => `user:${id}`,
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  USERS_LIST: 'users:list',
  CONVERSATION: (id: string) => `conversation:${id}`,
  CONVERSATIONS_BY_USER: (userId: string) => `conversations:user:${userId}`,
  APPLICATION: (id: string) => `application:${id}`,
  APPLICATIONS_LIST: 'applications:list',
  APPLICATIONS_BY_EMAIL: (email: string) => `applications:email:${email}`,
  EMAIL: (id: string) => `email:${id}`,
  EMAILS_INBOX: (email: string) => `emails:inbox:${email}`,
  LOG: (id: string) => `log:${id}`,
  LOGS_LIST: 'logs:list',
  ADMIN_LOG: (id: string) => `adminlog:${id}`,
  ADMIN_LOGS_LIST: 'adminlogs:list',
  EMAIL_TEMPLATE: (id: string) => `template:${id}`,
  EMAIL_TEMPLATES_LIST: 'templates:list',
};

export async function kvGet<T>(kv: KVNamespace, key: string): Promise<T | null> {
  const value = await kv.get(key);
  return value ? JSON.parse(value) : null;
}

export async function kvPut(kv: KVNamespace, key: string, value: any): Promise<void> {
  await kv.put(key, JSON.stringify(value));
}

export async function kvDelete(kv: KVNamespace, key: string): Promise<void> {
  await kv.delete(key);
}

export async function kvGetAll<T>(kv: KVNamespace, keys: string[]): Promise<(T | null)[]> {
  return Promise.all(keys.map(key => kvGet<T>(kv, key)));
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get('Origin');

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      env.FRONTEND_URL,
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin) && env.ENVIRONMENT === 'production') {
      return errorResponse('Forbidden', 'Origin not allowed', 403, origin);
    }

    const context = { env, request, url, method, origin, generateUUID, jsonResponse, errorResponse, readBody };

    try {
      if (path === '/api/health') {
        return handleHealth(context);
      }

      if (path.startsWith('/api/users')) {
        return handleUsers(context);
      }

      if (path.startsWith('/api/conversations')) {
        return handleConversations(context);
      }

      if (path.startsWith('/api/applications')) {
        return handleApplications(context);
      }

      if (path.startsWith('/api/emails')) {
        return handleEmails(context);
      }

      if (path.startsWith('/api/admin')) {
        return handleAdmin(context);
      }

      if (path.startsWith('/api/ai')) {
        return handleAI(context);
      }

      if (path.startsWith('/api/logs')) {
        return handleLogs(context);
      }

      return errorResponse('Not Found', 'Endpoint not found', 404, origin);
    } catch (error: any) {
      console.error('Worker error:', error);
      return errorResponse('Internal Server Error', error.message || 'An unexpected error occurred', 500, origin);
    }
  },
};

async function handleLogs(ctx: any): Promise<Response> {
  const { env, url, method, origin } = ctx;

  if (method === 'POST' && url.pathname === '/api/logs') {
    const body = await ctx.readBody(ctx.request);
    if (!body?.level || !body?.message) {
      return ctx.errorResponse('Missing required fields', 'Level and message are required', 400, origin);
    }

    const id = ctx.generateUUID();
    const timestamp = Date.now();
    const log = { id, level: body.level, message: body.message, source: body.source || 'worker', metadata: body.metadata || {}, timestamp };

    await kvPut(env.KV, KV_KEYS.LOG(id), log);
    
    const logsList = await kvGet<string[]>(env.KV, KV_KEYS.LOGS_LIST) || [];
    logsList.unshift(id);
    if (logsList.length > 1000) logsList.pop();
    await kvPut(env.KV, KV_KEYS.LOGS_LIST, logsList);

    return ctx.jsonResponse({ success: true, log }, 201, origin);
  }

  if (method === 'GET' && url.pathname === '/api/logs') {
    const level = url.searchParams.get('level');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const logsList = await kvGet<string[]>(env.KV, KV_KEYS.LOGS_LIST) || [];
    let logs = await kvGetAll<any>(env.KV, logsList.slice(0, limit));
    
    logs = logs.filter(l => l !== null);
    if (level) {
      logs = logs.filter((l: any) => l.level === level);
    }

    return ctx.jsonResponse({ logs }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Log endpoint not found', 404, origin);
}
