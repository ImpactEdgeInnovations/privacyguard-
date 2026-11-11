import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { test } from 'node:test';
import { createPreviewClient, readPreviewIdentity } from '../lib/identity/client.ts';
import { decideIdentity, identityCallback, previewSettings } from '../lib/identity/policy.ts';

const issuer = 'https://staging-project.supabase.co/auth/v1';
const claims = {
  sub: 'test-user', iss: issuer, aud: 'authenticated', role: 'authenticated', session_id: 'test-session', aal: 'aal1',
};
const user = {
  id: 'test-user', email_confirmed_at: '2026-11-10T00:00:00Z',
  app_metadata: { privacyguard_enabled: true, privacyguard_role: 'consumer' },
  user_metadata: { privacyguard_role: 'staff', privacyguard_enabled: true },
};

test('identity preview requires explicit opt-in, loopback and a publishable key', () => {
  const env = {
    PRIVACYGUARD_AUTH_PREVIEW: '1',
    PRIVACYGUARD_SUPABASE_URL: 'https://staging-project.supabase.co/',
    PRIVACYGUARD_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture',
  };
  assert.equal(previewSettings(env, '127.0.0.1:8768')?.issuer, issuer);
  assert.equal(previewSettings({ ...env, PRIVACYGUARD_LOCAL: '1' }, '127.0.0.1:8768'), null);
  assert.equal(previewSettings({ ...env, PRIVACYGUARD_AUTH_PREVIEW: '0' }, '127.0.0.1:8768'), null);
  assert.equal(previewSettings(env, 'localhost:8768'), null);
  assert.equal(previewSettings(env, 'privacyguard.example'), null);
  assert.equal(previewSettings({ ...env, PRIVACYGUARD_SUPABASE_PUBLISHABLE_KEY: 'invalid-key-class' }, '127.0.0.1:8768'), null);
  assert.equal(previewSettings({ ...env, PRIVACYGUARD_SUPABASE_URL: 'http://external.example' }, '127.0.0.1:8768'), null);
  assert.equal(previewSettings({ ...env, PRIVACYGUARD_SUPABASE_URL: 'http://127.0.0.1:54321' }, '127.0.0.1:8768')?.issuer,
    'http://127.0.0.1:54321/auth/v1');
});

test('verified email and fresh server-owned eligibility are required even with a signed session', () => {
  assert.deepEqual(decideIdentity(claims, user, issuer), { kind: 'verified', role: 'consumer' });
  assert.deepEqual(decideIdentity({ ...claims, sub: 'another-user' }, user, issuer), { kind: 'denied' });
  assert.deepEqual(decideIdentity({ ...claims, aud: 'other-app' }, user, issuer), { kind: 'denied' });
  assert.deepEqual(decideIdentity(claims, { ...user, email_confirmed_at: undefined }, issuer), { kind: 'denied' });
  assert.deepEqual(decideIdentity({ ...claims, is_anonymous: true }, user, issuer), { kind: 'denied' });
  assert.deepEqual(decideIdentity(claims, { ...user, app_metadata: { privacyguard_enabled: false } }, issuer), { kind: 'denied' });
});

test('staff and privacy roles require an active verified TOTP factor and signed TOTP assurance', () => {
  const factors = [
    { id: 'phone', status: 'verified', factor_type: 'phone' },
    { id: 'new', status: 'unverified', factor_type: 'totp' },
    { id: 'current', status: 'verified', factor_type: 'totp', friendly_name: 'Test device' },
  ];
  for (const role of ['staff', 'privacy'] as const) {
    const staff = { ...user, app_metadata: { privacyguard_role: role, privacyguard_enabled: true }, factors };
    assert.deepEqual(decideIdentity(claims, staff, issuer), { kind: 'mfa', factors: [{ id: 'current', label: 'Test device' }] });
    assert.equal(decideIdentity({ ...claims, aal: 'aal2', amr: ['mfa/phone'] }, staff, issuer).kind, 'mfa');
    const verified = { ...claims, aal: 'aal2', amr: [{ method: 'mfa/totp' }] };
    assert.deepEqual(decideIdentity(verified, staff, issuer), { kind: 'verified', role });
    assert.deepEqual(decideIdentity(verified, { ...staff, factors: [] }, issuer), { kind: 'mfa', factors: [] });
  }
});

test('the Supabase SDK carries a PKCE verifier across requests and rechecks eligibility', async t => {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const tokenBody = encode({ alg: 'HS256', typ: 'JWT' }) + '.' + encode({ ...claims, exp: now + 3600, iat: now });
  const token = tokenBody + '.' + createHmac('sha256', 'fixture-only-signing-key').update(tokenBody).digest('base64url');
  let requestedChallenge = '';
  let enabled = true;
  let exchanged = false;
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, 'https://staging-project.supabase.co');
    if (url.pathname === '/auth/v1/otp') {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.create_user, false);
      assert.equal(url.searchParams.get('redirect_to'), identityCallback);
      assert.equal(body.code_challenge_method, 's256');
      requestedChallenge = body.code_challenge;
      return Response.json({});
    }
    if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'pkce') {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.auth_code, 'synthetic-auth-code');
      assert.ok(requestedChallenge);
      assert.equal(createHash('sha256').update(body.code_verifier).digest('base64url'), requestedChallenge);
      exchanged = true;
      return Response.json({ access_token: token, refresh_token: 'fixture-refresh', expires_in: 3600, token_type: 'bearer', user });
    }
    if (url.pathname === '/auth/v1/user') {
      assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer ' + token);
      return Response.json({ ...user, app_metadata: { ...user.app_metadata, privacyguard_enabled: enabled } });
    }
    throw new Error('Unexpected fixture endpoint: ' + url.pathname);
  });

  const cookies = new Map<string, string>();
  const client = () => createPreviewClient({
    url: 'https://staging-project.supabase.co', issuer, key: 'sb_publishable_fixture',
  }, {
    getAll: () => Array.from(cookies, ([name, value]) => ({ name, value })),
    setAll: changes => {
      for (const { name, value, options } of changes) {
        assert.equal(options.httpOnly, true);
        assert.equal(options.path, '/identity');
        if (options.maxAge === 0) cookies.delete(name);
        else cookies.set(name, value);
      }
    },
  });

  const request = await client().auth.signInWithOtp({
    email: 'tester@example.invalid', options: { shouldCreateUser: false, emailRedirectTo: identityCallback },
  });
  assert.equal(request.error, null);
  const confirmation = await client().auth.exchangeCodeForSession('synthetic-auth-code');
  assert.equal(confirmation.error, null);
  assert.ok(exchanged);
  assert.deepEqual(await readPreviewIdentity(client(), issuer), { kind: 'verified', role: 'consumer' });
  enabled = false;
  assert.deepEqual(await readPreviewIdentity(client(), issuer), { kind: 'denied' });
});
