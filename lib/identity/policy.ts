export type PreviewRole = 'consumer' | 'staff' | 'privacy';
type Factor = { id: string; factor_type: string; status: string; friendly_name?: string };
type VerifiedClaims = {
  sub: string;
  iss: string;
  aud: string | string[];
  role: string;
  session_id: string;
  aal: string;
  is_anonymous?: boolean;
  amr?: (string | { method: string })[];
};
type ProviderUser = {
  id: string;
  email_confirmed_at?: string;
  is_anonymous?: boolean;
  banned_until?: string;
  app_metadata: Record<string, unknown>;
  factors?: Factor[];
};

export type IdentityResult =
  | { kind: 'signed_out' | 'denied' }
  | { kind: 'mfa'; factors: { id: string; label: string }[] }
  | { kind: 'verified'; role: PreviewRole };

export const identityCookie = 'pg_identity_preview';
export const identityOrigin = 'http://127.0.0.1:8768';
export const identityCallback = identityOrigin + '/identity/callback';

export function previewSettings(env: Record<string, string | undefined>, host: string | null) {
  if (env.PRIVACYGUARD_AUTH_PREVIEW !== '1' || env.PRIVACYGUARD_LOCAL === '1'
      || host !== '127.0.0.1:8768') return null;
  const key = env.PRIVACYGUARD_SUPABASE_PUBLISHABLE_KEY;
  const raw = env.PRIVACYGUARD_SUPABASE_URL;
  if (!key?.startsWith('sb_publishable_') || !raw) return null;
  try {
    const url = new URL(raw);
    const loopback = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))
        || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return { url: url.origin, issuer: url.origin + '/auth/v1', key };
  } catch {
    return null;
  }
}

export function decideIdentity(claims: VerifiedClaims, user: ProviderUser, issuer: string): IdentityResult {
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (claims.iss !== issuer || claims.role !== 'authenticated' || !aud.includes('authenticated')
      || !claims.session_id || claims.sub !== user.id || claims.is_anonymous || user.is_anonymous
      || !user.email_confirmed_at || (user.banned_until && Date.parse(user.banned_until) > Date.now())
      || user.app_metadata.privacyguard_enabled !== true) return { kind: 'denied' };

  const role = user.app_metadata.privacyguard_role;
  if (role === 'consumer') return { kind: 'verified', role };
  if (role !== 'staff' && role !== 'privacy') return { kind: 'denied' };

  const factors = (user.factors ?? []).filter(factor => factor.factor_type === 'totp' && factor.status === 'verified');
  const totpUsed = claims.amr?.some(entry => {
    const method = typeof entry === 'string' ? entry : entry.method;
    return method === 'totp' || method === 'mfa/totp';
  });
  if (claims.aal === 'aal2' && totpUsed && factors.length) return { kind: 'verified', role };
  return { kind: 'mfa', factors: factors.map((factor, index) => ({
    id: factor.id, label: factor.friendly_name || 'Authenticator ' + (index + 1),
  })) };
}
