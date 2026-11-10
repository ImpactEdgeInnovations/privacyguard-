import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decideIdentity, previewSettings } from '../lib/identity/policy.ts';

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
