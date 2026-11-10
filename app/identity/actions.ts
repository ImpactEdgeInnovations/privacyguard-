'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readPreviewIdentity } from '../../lib/identity/client';
import { identityClient } from '../../lib/identity/next';
import { identityCallback, identityCookie } from '../../lib/identity/policy';

function emailFrom(form: FormData) {
  const value = String(form.get('email') ?? '').trim();
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

export async function requestSignInEmail(form: FormData) {
  const { client } = await identityClient(true);
  const email = emailFrom(form);
  if (!email) redirect('/identity?notice=email');
  // Always use the same response whether the invited account exists or delivery is refused.
  await client.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: identityCallback } });
  redirect('/identity?step=sent');
}

export async function confirmEmailCode(form: FormData) {
  const { client } = await identityClient(true);
  const email = emailFrom(form);
  const token = String(form.get('code') ?? '').trim();
  if (!email || !/^\d{6,10}$/.test(token)) redirect('/identity?step=code&notice=code');
  const result = await client.auth.verifyOtp({ email, token, type: 'email' });
  if (result.error || !result.data.session) redirect('/identity?step=code&notice=code');
  redirect('/identity');
}

export async function confirmAuthenticator(form: FormData) {
  const { client, issuer } = await identityClient(true);
  const identity = await readPreviewIdentity(client, issuer);
  if (identity.kind !== 'mfa') redirect('/identity');
  const factorId = String(form.get('factor') ?? '');
  const code = String(form.get('code') ?? '').trim();
  if (!identity.factors.some(factor => factor.id === factorId) || !/^\d{6}$/.test(code)) {
    redirect('/identity?notice=mfa');
  }
  const result = await client.auth.mfa.challengeAndVerify({ factorId, code });
  if (result.error) redirect('/identity?notice=mfa');
  redirect('/identity');
}

export async function exitIdentityPreview() {
  const { client } = await identityClient(true);
  await client.auth.signOut({ scope: 'local' });
  const jar = await cookies();
  for (const { name } of jar.getAll()) {
    if (name === identityCookie || name.startsWith(identityCookie + '.') || name === identityCookie + '-code-verifier') {
      jar.set(name, '', { path: '/identity', httpOnly: true, sameSite: 'lax', maxAge: 0 });
    }
  }
  redirect('/identity');
}
