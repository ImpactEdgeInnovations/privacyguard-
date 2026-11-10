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

export async function readPreviewIdentity(client: ReturnType<typeof createPreviewClient>, issuer: string): Promise<IdentityResult> {
  const claims = await client.auth.getClaims();
  if (claims.error || !claims.data?.claims) return { kind: 'signed_out' };
  // Fetch current server-owned eligibility so offboarding does not depend on JWT expiry.
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { kind: 'denied' };
  return decideIdentity(claims.data.claims, data.user, issuer);
}
