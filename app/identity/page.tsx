import Link from 'next/link';
import { readPreviewContext } from '../../lib/identity/client';
import { identityClient } from '../../lib/identity/next';
import { Icon } from '../workspace-nav';
import { confirmAuthenticator, confirmEmailCode, exitIdentityPreview, requestSignInEmail } from './actions';
import { AuthenticatorSetup } from './authenticator-setup';

export const dynamic = 'force-dynamic';

const notices: Record<string, string> = {
  email: 'Enter a valid email address for your invited test account.',
  code: 'That code could not be verified. Check the email and enter the latest code.',
  link: 'That sign-in link could not be verified. Request a new one and open it in this browser.',
  mfa: 'That authenticator code could not be verified. Check the selected device and try again.',
  setup: 'Setup could not be completed. If you entered an incorrect code or left the setup page, start setup again and replace the unfinished entry in your authenticator app.',
};

const roles = { consumer: 'Consumer', staff: 'Staff reviewer', privacy: 'Privacy reviewer' };

export default async function IdentityPreview({ searchParams }: { searchParams: Promise<{ step?: string; notice?: string }> }) {
  const { client, issuer } = await identityClient(false);
  const { identity, user } = await readPreviewContext(client, issuer);
  const params = await searchParams;
  const codeStep = params.step === 'code';
  const sentStep = params.step === 'sent';
  const notice = typeof params.notice === 'string' && Object.hasOwn(notices, params.notice) ? notices[params.notice] : null;

  return <>
    <header className="top"><div className="shell top-inner">
      <Link href="/identity" className="brand" aria-label="PrivacyGuard Kenya"><span className="mark"><Icon name="shield" /></span>
        <span>privacyguard<span className="brand-dot">.</span></span><span className="country">Kenya</span>
      </Link>
      {identity.kind !== 'signed_out' && <form action={exitIdentityPreview}><button className="text-button">Sign out</button></form>}
    </div></header>
    <div className="sandbox"><div className="shell"><strong>Identity preview</strong> · Invited test accounts only.</div></div>
    <main id="content" className="shell workspace">
      <section className="hero identity-hero">
        <div className="hero-story">
          <p className="eyebrow icon-text"><Icon name="lock" /> Private workspace</p>
          <h1>Verify your access</h1>
          <p className="lede">Use your invited email. Staff and privacy reviewers also confirm access with an authenticator.</p>
        </div>
        <section className="panel access" aria-labelledby="identity-step">
          {notice && <p role="alert" className="notice">{notice}</p>}
          {identity.kind === 'signed_out' && (sentStep ? <>
            <h2 id="identity-step">Check your email</h2>
            <p className="muted">If your address is invited, open the latest sign-in link in the same browser you used here.</p>
            <div className="form-end identity-links"><Link className="secondary" href="/identity">Try another email</Link><Link href="/identity?step=code">I received a code instead</Link></div>
          </> : codeStep ? <>
            <h2 id="identity-step">Enter your email code</h2>
            <p className="muted">If your address is invited, a code can arrive in your inbox. Use the latest code.</p>
            <form action={confirmEmailCode} className="form-stack">
              <label>Invited email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
              <label>Email code<input name="code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6,10}" maxLength={10} /></label>
              <div className="form-end"><button className="primary">Verify email</button><Link href="/identity">Request a new email</Link></div>
            </form>
          </> : <>
            <h2 id="identity-step">Sign in with email</h2>
            <p className="muted">Enter the address you were invited to use.</p>
            <form action={requestSignInEmail} className="form-stack">
              <label>Invited email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
              <div><button className="primary">Send sign-in email</button></div>
            </form>
          </>)}
          {identity.kind === 'denied' && <>
            <h2 id="identity-step">Access unavailable</h2>
            <p className="muted">Ask the staging administrator to check your invitation. You can sign out and try another invited account.</p>
          </>}
          {identity.kind === 'mfa' && <>
            <h2 id="identity-step">{identity.factors.length ? 'Confirm your authenticator' : 'Set up your authenticator'}</h2>
            {identity.factors.length ? <>
              <p className="muted">Enter the current six-digit code from your enrolled authenticator.</p>
              <form action={confirmAuthenticator} className="form-stack">
                <label>Authenticator<select name="factor" required>{identity.factors.map(factor =>
                  <option key={factor.id} value={factor.id}>{factor.label}</option>)}</select></label>
                <label>Authenticator code<input name="code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} /></label>
                <div><button className="primary">Verify authenticator</button></div>
              </form>
            </> : user?.factors?.some(factor => factor.status === 'verified') ?
              <p className="muted">Your account has another verified factor. Ask your administrator to arrange authenticator setup through a verified session.</p> : <AuthenticatorSetup />}
            <details className="separator identity-help"><summary>Lost access to your authenticator?</summary>
              <p>Contact the administrator who invited you using your established support channel. They must verify your identity and review account access before arranging a reset.</p>
              <p>Never send an email code, authenticator code or setup key to anyone. Signing in again by email will still require your enrolled authenticator.</p>
            </details>
          </>}
          {identity.kind === 'verified' && <>
            <p className="eyebrow">Access check passed</p>
            <h2 id="identity-step">{roles[identity.role]} identity verified</h2>
            <p className="muted">This preview ends at the access check. Case management runs in the separate fictional workspace.</p>
          </>}
        </section>
      </section>
    </main>
    <footer className="shell footer">PrivacyGuard Kenya <span>Independent of the Office of the Data Protection Commissioner</span></footer>
  </>;
}
