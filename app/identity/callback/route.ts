import { NextResponse } from 'next/server';
import { identityClient } from '../../../lib/identity/next';
import { identityOrigin } from '../../../lib/identity/policy';

export async function GET(request: Request) {
  const { client } = await identityClient(true);
  const code = new URL(request.url).searchParams.get('code');
  const destination = new URL('/identity', identityOrigin);
  if (!code || code.length > 512) {
    destination.searchParams.set('notice', 'link');
  } else {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) destination.searchParams.set('notice', 'link');
  }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
