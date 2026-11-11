'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { SetupState } from '../../lib/identity/enrollment';
import { discardAuthenticatorSetup, finishAuthenticatorSetup, startAuthenticatorSetup } from './actions';

function VerifyButton() {
  const { pending } = useFormStatus();
  return <button className="primary" disabled={pending}>{pending ? 'Checking code…' : 'Verify and finish setup'}</button>;
}

export function AuthenticatorSetup() {
  const [state, action, pending] = useActionState(startAuthenticatorSetup, {} as SetupState);
  const [verification, verifyAction] = useActionState(finishAuthenticatorSetup, {} as { message?: string });
  if (!state.setup) return <>
    <p className="muted">Add PrivacyGuard to your authenticator app, then verify its six-digit code to complete setup.</p>
    <form action={action} className="form-stack">
      {state.message && <p role="alert" className="notice">{state.message}</p>}
      <div><button className="primary" disabled={pending}>{pending ? 'Starting setup…' : 'Set up authenticator'}</button></div>
    </form>
  </>;

  return <div className="form-stack">
    <ol className="setup-steps">
      <li>Open your authenticator app and choose to add an account.</li>
      <li>Scan this QR code, or enter the setup key manually.
        {/* Provider-generated SVG is an image resource, never inserted as HTML. */}
        {state.setup.qrCode && <img className="authenticator-qr" src={state.setup.qrCode} alt="QR code for adding PrivacyGuard to your authenticator" width={208} height={208} />}
        <details><summary>Show manual setup key</summary><p className="setup-key">{state.setup.secret}</p><p>Account issuer · PrivacyGuard Kenya. Type · Time based.</p></details>
      </li>
      <li>Enter the current six-digit code from that account.</li>
    </ol>
    <p className="muted">Keep the setup key private. This page will not show it again after you leave.</p>
    <form action={verifyAction} className="form-stack">
      {verification.message && <p className="notice" role="alert">{verification.message}</p>}
      <input type="hidden" name="factor" value={state.setup.factorId} />
      <label>Authenticator code<input name="code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} /></label>
      <div><VerifyButton /></div>
    </form>
    <form action={discardAuthenticatorSetup}><input type="hidden" name="factor" value={state.setup.factorId} /><button className="text-button">Cancel setup</button></form>
  </div>;
}
