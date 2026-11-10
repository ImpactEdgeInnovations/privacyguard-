import Link from 'next/link';
import { privacyKinds, type Case, type PrivacyRequest } from '../lib/intake';
import { updatePrivacyRequest } from './actions';
import { Icon } from './workspace-nav';

const shortId = (id: string) => 'PG-' + id.slice(0, 8).toUpperCase();
const dateFormat = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeZone: 'Africa/Nairobi' });
const expiryFormat = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' });

function RequestBadge({ request }: { request: PrivacyRequest }) {
  const labels = {
    copy_ready: request.can_download ? 'Copy ready' : 'Link expired',
    copy_unavailable: 'Copy unavailable',
    held: 'On hold',
    reviewing: 'In review',
    removed: 'Case removed',
  };
  return <span className={request.outcome === 'held' ? 'badge amber' : 'badge'}>
    {request.outcome ? labels[request.outcome] : request.claimed_at ? 'In review' : 'Request received'}
  </span>;
}

function RequestDetails({ request }: { request: PrivacyRequest }) {
  return <div className="request-details">
    <RequestBadge request={request} />
    {request.can_download && request.available_until && <>
      <a className="secondary" href={'/privacy/copy/' + request.id}>Download case copy (JSON)</a>
      <p className="muted help">Available until {expiryFormat.format(request.available_until)} EAT. Keep downloaded copies private.</p>
    </>}
    {request.outcome === 'copy_ready' && !request.can_download && <p className="muted help">Ask the privacy reviewer to reopen the download window.</p>}
    {request.outcome === 'copy_unavailable' && <p className="muted help">The case was removed from the sandbox.</p>}
    {request.outcome === 'held' && request.review_on && <p className="muted help">
      {request.note} Review date {dateFormat.format(new Date(request.review_on + 'T12:00:00Z'))}.
    </p>}
    {request.outcome === 'removed' && <p className="muted help">The sandbox report and its activity were removed. This request receipt remains in your history.</p>}
  </div>;
}

export function PrivacyCenter({ reports, requests, scope }: { reports: Case[]; requests: PrivacyRequest[]; scope?: string }) {
  const selected = reports.find(report => report.id === scope);
  return <>
    <div className="heading"><div><p className="eyebrow icon-text"><Icon name="lock" /> Privacy by design</p><h1>Your data and choices</h1><p className="lede">Choose the report you want to manage and track your requests here.</p></div></div>
    <div className="case-grid">
      <div className="stack">
        <section className="panel privacy-note"><p className="eyebrow icon-text"><Icon name="shield" /> Share only what’s needed</p><h2>We do not ask for national ID</h2><p className="muted">Leave out ID numbers, ID photos and information about other people when describing a call or message.</p></section>
        <section className="panel">
          <h2>Case controls</h2>
          {reports.length ? <>
            <form method="get" className="form-stack"><input type="hidden" name="view" value="privacy" />
              <label>Choose a report<select name="scope" required defaultValue={selected?.id ?? ''}><option value="" disabled>Select a report</option>
                {reports.map(report => <option value={report.id} key={report.id}>{shortId(report.id)} · {report.sender || 'Unidentified sender'}</option>)}
              </select></label><div><button className="secondary">Show case controls</button></div>
            </form>
            {selected && <div className="privacy-actions"><p className="eyebrow">{shortId(selected.id)} · {selected.sender || 'Unidentified sender'}</p>
              {Object.keys(privacyKinds).map(kind => {
                const existing = requests.find(request => request.case_id === selected.id && request.kind === kind);
                return <section key={kind}><h3>{kind === 'copy' ? 'Get a copy of your data' : 'Request deletion'}</h3>
                  <p className="muted">{kind === 'copy' ? 'Ask for a copy of the records for this report.' : 'Ask us to review which records for this report can be removed.'}</p>
                  {existing ? <RequestDetails request={existing} /> : <form action={updatePrivacyRequest}>
                    <input type="hidden" name="caseId" value={selected.id} /><input type="hidden" name="kind" value={kind} />
                    <button className="secondary">{kind === 'copy' ? 'Request a copy' : 'Request deletion'}</button>
                  </form>}
                </section>;
              })}
            </div>}
          </> : <><p className="muted">Save a report to manage its records here.</p><Link className="secondary" href="/?view=new">Check a message</Link></>}
        </section>
      </div>
      <section className="panel">
        <p className="eyebrow">Privacy activity</p><h2>Your requests <span className="count">{requests.length}</span></h2>
        <p className="muted">Track the reviewer’s decision for each case here.</p>
        {requests.length > 0 && <ul className="rows">{requests.map(request => <li className="request-row" key={request.id}>
          <div><strong>{privacyKinds[request.kind]}</strong><p>{shortId(request.case_id)} · {dateFormat.format(request.requested_at)}</p></div>
          {selected?.id === request.case_id ? <RequestBadge request={request} /> : <RequestDetails request={request} />}
        </li>)}</ul>}
      </section>
    </div>
  </>;
}

function DecisionForm({ request, action, label, children }: {
  request: PrivacyRequest; action: string; label: string; children?: React.ReactNode;
}) {
  return <form action={updatePrivacyRequest} className="form-stack">
    <input type="hidden" name="id" value={request.id} /><input type="hidden" name="action" value={action} />
    {children}<div><button className="secondary">{label}</button></div>
  </form>;
}

export function PrivacyQueue({ requests }: { requests: PrivacyRequest[] }) {
  return <>
    <div className="heading"><div><p className="eyebrow icon-text"><Icon name="lock" /> Operations</p><h1>Privacy requests</h1><p className="lede">Review each case request and record what the consumer can do next.</p></div></div>
    <section className="panel queue">
      <h2>Request queue <span className="count">{requests.length}</span></h2>
      {requests.length ? <ul className="rows">{requests.map(request => <li className="request-row" key={request.id}>
        <div className="task-row"><div><strong>{privacyKinds[request.kind]}</strong><p>{shortId(request.case_id)} · {dateFormat.format(request.requested_at)}</p></div><RequestBadge request={request} /></div>
        {!request.claimed_at && !request.outcome && <DecisionForm request={request} action="claim" label="Take request" />}
        {request.claimed_at && request.kind === 'copy' && !request.can_download && request.outcome !== 'copy_unavailable' &&
          <DecisionForm request={request} action="release_copy" label={request.outcome ? 'Reopen copy for 24 hours' : 'Make copy available for 24 hours'} />}
        {request.outcome === 'held' && <><p className="muted">{request.note} Review date {request.review_on}.</p>
          <DecisionForm request={request} action="release_hold" label="Release hold" /></>}
        {request.claimed_at && request.kind === 'deletion' && (!request.outcome || request.outcome === 'reviewing') &&
          <div className="queue-grid">
            <DecisionForm request={request} action="hold" label="Record hold">
              <label>Reason visible to the consumer<textarea name="note" required minLength={10} maxLength={240} rows={2} /></label>
              <label>Review date<input type="date" name="reviewOn" required /></label>
            </DecisionForm>
            <DecisionForm request={request} action="remove" label="Remove fictional case">
              <label className="check-label"><input type="checkbox" name="confirmed" required /><span>I confirm removal of this sandbox case and its activity.</span></label>
            </DecisionForm>
          </div>}
      </li>)}</ul> : <p className="muted">There are no privacy requests in the queue.</p>}
    </section>
  </>;
}
