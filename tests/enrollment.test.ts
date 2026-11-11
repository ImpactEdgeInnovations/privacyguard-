import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import { createPreviewClient, readPreviewIdentity } from '../lib/identity/client.ts';
import { beginAuthenticatorSetup, cancelAuthenticatorSetup, verifyFirstAuthenticator } from '../lib/identity/enrollment.ts';

test('first TOTP setup uses the SDK, verifies ownership and persists AAL2 across requests', async t => {
  const origin = 'https://staging-project.supabase.co';
  const issuer = origin + '/auth/v1';
  type Factor = { id: string; factor_type: string; status: string; friendly_name: string };
  let factors: Factor[] = [];
  let role = 'staff';
  let enabled = true;
  let sequence = 0;
  let mutations = 0;
  let refuseEnroll = false;
  let refuseDelete = false;
  const deleted: string[] = [];
  const user = () => ({
    id: 'fixture-user', email_confirmed_at: '2026-11-11T00:00:00Z',
    app_metadata: { privacyguard_enabled: enabled, privacyguard_role: role }, factors,
  });
  function token(aal: string) {
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const body = encode({ alg: 'HS256', typ: 'JWT' }) + '.' + encode({
      sub: 'fixture-user', iss: issuer, aud: 'authenticated', role: 'authenticated', session_id: 'fixture-session',
      aal, amr: [{ method: aal === 'aal2' ? 'totp' : 'otp' }], exp: now + 3600, iat: now,
    });
    return body + '.' + createHmac('sha256', 'fixture-only-key').update(body).digest('base64url');
  }
  const session = (aal: string) => ({ access_token: token(aal), refresh_token: 'fixture-refresh', token_type: 'bearer', expires_in: 3600, user: user() });
  const failure = () => Response.json({ msg: 'Fixture refusal', code: 'fixture_refusal' }, { status: 400 });
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, origin);
    assert.equal(init?.cache, 'no-store');
    if (url.pathname === '/auth/v1/user') return Response.json(user());
    assert.equal(init?.method === 'POST' || init?.method === 'DELETE', true);
    mutations++;
    if (url.pathname === '/auth/v1/factors') {
      if (refuseEnroll) return failure();
      const body = JSON.parse(String(init?.body));
      assert.equal(body.factor_type, 'totp');
      assert.equal(body.issuer, 'PrivacyGuard Kenya');
      const factor = { id: 'fixture-factor-' + ++sequence, factor_type: 'totp', status: 'unverified', friendly_name: body.friendly_name };
      factors.push(factor);
      return Response.json({ ...factor, type: 'totp', totp: { secret: 'FIXTUREKEYONLY', qr_code: '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#103445"/></svg>', uri: 'otpauth://fixture' } });
    }
    const match = url.pathname.match(/^\/auth\/v1\/factors\/([^/]+)(?:\/(challenge|verify))?$/);
    assert.ok(match);
    const factor = factors.find(item => item.id === match[1]);
    assert.ok(factor);
    if (init?.method === 'DELETE') {
      if (refuseDelete) return failure();
      assert.equal(factor.status, 'unverified');
      deleted.push(factor.id);
      factors = factors.filter(item => item.id !== factor.id);
      return Response.json({ id: factor.id });
    }
    if (match[2] === 'challenge') return Response.json({ id: 'fixture-challenge', type: 'totp', expires_at: Date.now() / 1000 + 300 });
    const body = JSON.parse(String(init?.body));
    assert.equal(body.challenge_id, 'fixture-challenge');
    if (body.code !== '123456') return failure();
    factor.status = 'verified';
    return Response.json(session('aal2'));
  });

  const jar = new Map<string, string>();
  const client = () => createPreviewClient({ url: origin, issuer, key: 'sb_publishable_fixture' }, {
    getAll: () => Array.from(jar, ([name, value]) => ({ name, value })),
    setAll: changes => changes.forEach(({ name, value, options }) => {
      assert.equal(options.httpOnly, true);
      assert.equal(options.path, '/identity');
      if (options.maxAge === 0) jar.delete(name);
      else jar.set(name, value);
    }),
  });
  assert.equal((await client().auth.setSession(session('aal1'))).error, null);

  const first = await beginAuthenticatorSetup(client(), issuer);
  assert.ok(first.setup);
  assert.equal(first.setup.secret, 'FIXTUREKEYONLY');
  assert.ok(first.setup.qrCode.startsWith('data:image/svg+xml;base64,'));
  assert.ok(Buffer.from(first.setup.qrCode.split(',')[1], 'base64').toString('utf8').includes('#103445'));
  assert.equal(await verifyFirstAuthenticator(client(), issuer, first.setup.factorId, '000000'), false);
  assert.equal((await readPreviewIdentity(client(), issuer)).kind, 'mfa');
  const beforeTamper = mutations;
  assert.equal(await verifyFirstAuthenticator(client(), issuer, 'someone-elses-factor', '123456'), false);
  assert.equal(await cancelAuthenticatorSetup(client(), issuer, 'someone-elses-factor'), false);
  assert.equal(await verifyFirstAuthenticator(client(), issuer, first.setup.factorId, 'bad'), false);
  assert.equal(mutations, beforeTamper);

  factors.push({ id: 'unrelated-pending', factor_type: 'totp', status: 'unverified', friendly_name: 'Other app' });
  const restarted = await beginAuthenticatorSetup(client(), issuer);
  assert.ok(restarted.setup);
  assert.deepEqual(deleted, [first.setup.factorId]);
  assert.ok(factors.some(factor => factor.id === 'unrelated-pending'));
  assert.equal(await verifyFirstAuthenticator(client(), issuer, first.setup.factorId, '123456'), false);

  enabled = false;
  const beforeWithdrawal = mutations;
  assert.equal((await beginAuthenticatorSetup(client(), issuer)).setup, undefined);
  assert.equal(await verifyFirstAuthenticator(client(), issuer, restarted.setup.factorId, '123456'), false);
  assert.equal(await cancelAuthenticatorSetup(client(), issuer, restarted.setup.factorId), false);
  assert.equal(mutations, beforeWithdrawal);
  enabled = true;
  role = 'consumer';
  assert.equal((await beginAuthenticatorSetup(client(), issuer)).setup, undefined);
  assert.equal(await verifyFirstAuthenticator(client(), issuer, restarted.setup.factorId, '123456'), false);
  role = 'privacy';

  factors.push({ id: 'existing-phone', factor_type: 'phone', status: 'verified', friendly_name: 'Phone' });
  const beforeExistingFactor = mutations;
  assert.equal((await beginAuthenticatorSetup(client(), issuer)).setup, undefined);
  assert.equal(await verifyFirstAuthenticator(client(), issuer, restarted.setup.factorId, '123456'), false);
  assert.equal(mutations, beforeExistingFactor);
  factors = factors.filter(factor => factor.id !== 'existing-phone');

  assert.equal(await verifyFirstAuthenticator(client(), issuer, restarted.setup.factorId, '123456'), true);
  assert.deepEqual(await readPreviewIdentity(client(), issuer), { kind: 'verified', role: 'privacy' });
  const beforeVerified = mutations;
  assert.equal((await beginAuthenticatorSetup(client(), issuer)).setup, undefined);
  assert.equal(await cancelAuthenticatorSetup(client(), issuer, restarted.setup.factorId), false);
  assert.equal(mutations, beforeVerified);

  // A removed factor invalidates access even while an AAL2 token remains in the cookie.
  factors = [];
  assert.equal((await readPreviewIdentity(client(), issuer)).kind, 'mfa');
  refuseEnroll = true;
  assert.equal((await beginAuthenticatorSetup(client(), issuer)).setup, undefined);
  refuseEnroll = false;
  const cancellable = await beginAuthenticatorSetup(client(), issuer);
  assert.ok(cancellable.setup);
  refuseDelete = true;
  assert.equal(await cancelAuthenticatorSetup(client(), issuer, cancellable.setup.factorId), false);
  assert.equal((await beginAuthenticatorSetup(client(), issuer)).setup, undefined);
  refuseDelete = false;
  assert.equal(await cancelAuthenticatorSetup(client(), issuer, cancellable.setup.factorId), true);
  assert.deepEqual(factors, []);
});
