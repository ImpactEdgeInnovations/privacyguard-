import { NextResponse, type NextRequest } from 'next/server';
import { createPreviewClient } from './lib/identity/client';
import { identityCookie, previewSettings } from './lib/identity/policy';

export async function proxy(request: NextRequest) {
  const config = previewSettings(process.env, request.headers.get('host'));
  let response = NextResponse.next({ request });
  if (config && request.cookies.getAll().some(({ name }) => name === identityCookie || name.startsWith(identityCookie + '.'))) {
    const client = createPreviewClient(config, {
      getAll: () => request.cookies.getAll(),
      setAll: (changes, authHeaders) => {
        for (const { name, value } of changes) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of changes) response.cookies.set(name, value, options);
        for (const [name, value] of Object.entries(authHeaders)) response.headers.set(name, value);
      },
    });
    await client.auth.getClaims();
  }
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

export const config = { matcher: '/identity/:path*' };
