import { createPreviewClient, readPreviewContext } from './client.ts';

type Client = ReturnType<typeof createPreviewClient>;
export type SetupState = { message?: string; setup?: { factorId: string; secret: string; qrCode: string } };
const label = 'PrivacyGuard preview';

async function enrollmentContext(client: Client, issuer: string) {
  const context = await readPreviewContext(client, issuer);
  if (context.identity.kind !== 'mfa' || !context.user) return null;
  // First-factor setup only. An existing verified factor must never be replaced at AAL1.
  if (context.user.factors?.some(factor => factor.status === 'verified')) return null;
  return context.user;
}

export async function beginAuthenticatorSetup(client: Client, issuer: string): Promise<SetupState> {
  const user = await enrollmentContext(client, issuer);
  if (!user) return { message: 'Setup is unavailable. Return to the access check or ask your administrator for help.' };
  // Remove only this preview's abandoned, unverified TOTP enrollments.
  for (const factor of user.factors ?? []) {
    if (factor.factor_type === 'totp' && factor.status === 'unverified' && factor.friendly_name === label) {
      const { error } = await client.auth.mfa.unenroll({ factorId: factor.id });
      if (error) return { message: 'Setup could not restart. Try again or contact your administrator.' };
    }
  }
  const { data, error } = await client.auth.mfa.enroll({ factorType: 'totp', friendlyName: label, issuer: 'PrivacyGuard Kenya' });
  if (error || !data) return { message: 'Setup could not start. Try again or contact your administrator.' };
  // The SDK prefixes raw SVG. Encode it so SVG colors containing '#' cannot become URL fragments.
  const prefix = 'data:image/svg+xml;utf-8,';
  const svg = data.totp.qr_code.startsWith(prefix) ? data.totp.qr_code.slice(prefix.length) : '';
  const qrCode = svg ? 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64') : '';
  return { setup: { factorId: data.id, secret: data.totp.secret, qrCode } };
}

export async function verifyFirstAuthenticator(client: Client, issuer: string, factorId: string, code: string) {
  if (!/^\d{6}$/.test(code)) return false;
  const user = await enrollmentContext(client, issuer);
  if (!user?.factors?.some(factor => factor.id === factorId && factor.factor_type === 'totp'
      && factor.status === 'unverified' && factor.friendly_name === label)) return false;
  const { error } = await client.auth.mfa.challengeAndVerify({ factorId, code });
  return !error;
}

export async function cancelAuthenticatorSetup(client: Client, issuer: string, factorId: string) {
  const user = await enrollmentContext(client, issuer);
  if (!user?.factors?.some(factor => factor.id === factorId && factor.factor_type === 'totp'
      && factor.status === 'unverified' && factor.friendly_name === label)) return false;
  const { error } = await client.auth.mfa.unenroll({ factorId });
  return !error;
}
