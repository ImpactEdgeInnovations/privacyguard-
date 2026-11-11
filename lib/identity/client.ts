import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { decideIdentity, identityCookie, type IdentityResult, previewSettings } from './policy.ts';

type Config = NonNullable<ReturnType<typeof previewSettings>>;

export function createPreviewClient(config: Config, cookies: CookieMethodsServer) {
  return createServerClient(config.url, config.key, {
    cookies: { ...cookies, encode: 'tokens-only' },
    cookieOptions: { name: identityCookie, httpOnly: true, sameSite: 'lax', path: '/identity' },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

export async function readPreviewContext(client: ReturnType<typeof createPreviewClient>, issuer: string) {
  const claims = await client.auth.getClaims();
  if (claims.error || !claims.data?.claims) return { identity: { kind: 'signed_out' } as IdentityResult, user: null };
  // Fetch current server-owned eligibility so offboarding does not depend on JWT expiry.
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { identity: { kind: 'denied' } as IdentityResult, user: null };
  return { identity: decideIdentity(claims.data.claims, data.user, issuer), user: data.user };
}

export async function readPreviewIdentity(client: ReturnType<typeof createPreviewClient>, issuer: string): Promise<IdentityResult> {
  return (await readPreviewContext(client, issuer)).identity;
}
