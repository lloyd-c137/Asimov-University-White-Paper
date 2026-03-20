export interface Env {
  DB: D1Database;
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

    await env.DB.prepare(
      'INSERT INTO logs (id, level, message, source, metadata, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(id, body.level, body.message, body.source || 'worker', JSON.stringify(body.metadata || {}), timestamp)
      .run();

    return ctx.jsonResponse({
      success: true,
      log: { id, level: body.level, message: body.message, source: body.source, metadata: body.metadata, timestamp },
    }, 201, origin);
  }

  if (method === 'GET' && url.pathname === '/api/logs') {
    const level = url.searchParams.get('level');
    const source = url.searchParams.get('source');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM logs';
    const params: any[] = [];
    const conditions: string[] = [];

    if (level) {
      conditions.push('level = ?');
      params.push(level);
    }
    if (source) {
      conditions.push('source = ?');
      params.push(source);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();

    return ctx.jsonResponse({
      logs: result.results.map((log: any) => ({
        id: log.id,
        level: log.level,
        message: log.message,
        source: log.source,
        metadata: JSON.parse(log.metadata || '{}'),
        timestamp: log.timestamp,
      })),
    }, 200, origin);
  }

  return ctx.errorResponse('Not Found', 'Log endpoint not found', 404, origin);
}
