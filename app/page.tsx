import Link from 'next/link';
import { currentActor, localEnabled, store } from '../lib/local';
import { channels, goals, newReportId, readId, returnReasons, type Actor, type Case, type CaseEvent, type QueueTask } from '../lib/intake';
import { signIn, signOut, updateReport } from './actions';
import { PrivacyCenter, PrivacyQueue } from './privacy';
import { ConsumerNavigation, Icon, type ConsumerPage } from './workspace-nav';

export const dynamic = 'force-dynamic';

const status: Record<Case['state'], string> = {
  draft: 'Draft saved', received: 'Report received', in_review: 'In review', needs_detail: 'Your reply needed', reviewed: 'Screening complete',
};
const events: Record<CaseEvent['kind'], string> = {
  saved: 'Draft saved', submitted: 'Report received', claimed: 'Reviewer assigned', asked_detail: 'Reviewer requested a detail',
  detail_added: 'You added a detail', reviewed: 'Screening completed', returned: 'Review returned to the work queue',
};
const shortId = (id: string) => 'PG-' + id.slice(0, 8).toUpperCase();
const timeFormat = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi' });
const dateFormat = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeZone: 'UTC' });
const receivedDate = (date: string | null) => date ? dateFormat.format(new Date(date)) : 'Not sure';

function Badge({ state, staff = false }: { state: Case['state']; staff?: boolean }) {
  return <span className={state === 'needs_detail' ? 'badge amber' : 'badge'}>{staff && state === 'needs_detail' ? 'Waiting for consumer' : status[state]}</span>;
}

function Frame({ children, actor, page = 'home' }: { children: React.ReactNode; actor?: Actor; page?: ConsumerPage }) {
  return <>
    <header className="top">
      <div className="shell top-inner">
        <Link href="/" className="brand" aria-label="PrivacyGuard Kenya"><span className="mark"><Icon name="shield" /></span><span>privacyguard<span className="brand-dot">.</span></span><span className="country">Kenya</span></Link>
        {actor && <nav aria-label="Workspace" className="top-nav">
          {actor.role !== 'consumer' && <Link href="/?view=home">{actor.role === 'staff' ? 'Work queue' : 'Privacy requests'}</Link>}
          <form action={signOut}><button className="text-button">Switch account</button></form>
        </nav>}
      </div>
    </header>
    {localEnabled() && <div className="sandbox"><div className="shell"><strong>Local sandbox</strong> · Use fictional reports only.{actor && <span className="actor">{actor.name}</span>}</div></div>}
    {actor?.role === 'consumer' ? <div className="workspace-layout">
      <aside className="workspace-rail"><p className="rail-label">Your private space</p><ConsumerNavigation page={page} /></aside>
      <main id="content" className="shell workspace">{children}</main>
    </div> : <main id="content" className="shell workspace">{children}</main>}
    <footer className="shell footer">PrivacyGuard Kenya <span>Independent of the Office of the Data Protection Commissioner</span></footer>
  </>;
}

function Landing() {
  return <Frame><section className="hero">
    <div className="hero-story">
      <p className="eyebrow icon-text"><Icon name="shield" /> A private place to start</p>
      <h1>Unwanted marketing?<br /><em>Choose what happens next.</em></h1>
      <p className="lede">Keep a record of a call or message. Start with a short description, save it privately, and track the review when you’re ready to submit.</p>
      <div className="hero-steps"><span>01 Describe it</span><span>02 Save privately</span><span>03 Follow your case</span></div>
    </div>
    {localEnabled() ? <section className="panel access" aria-labelledby="start-heading">
      <p className="eyebrow">Phase 1 workspace</p><h2 id="start-heading">Choose a fictional account</h2>
      <p className="muted">Try intake as a consumer or open the staff queue as a reviewer.</p>
      <form action={signIn} className="form-stack">
        <label>Demo account<select name="persona"><option value="a">Consumer A</option><option value="b">Consumer B</option><option value="reviewer">Reviewer A</option><option value="backup">Reviewer B</option><option value="privacy">Privacy Reviewer</option></select></label>
        <button className="primary">Open workspace <span aria-hidden="true">→</span></button>
      </form>
    </section> : <section className="panel"><h2>Workspace unavailable</h2><p>This build runs in a local development workspace.</p></section>}
  </section></Frame>;
}

function ConsumerHome({ reports }: { reports: Case[] }) {
  const latest = reports.find(report => report.state === 'needs_detail') ?? reports[0];
  return <>
    <div className="heading"><div><p className="eyebrow icon-text"><Icon name="shield" /> Your private case workspace</p><h1>My cases</h1><p className="lede">See what happened and what you can do next.</p></div>{latest && <Link className="secondary" href="/?view=new">Check a message <span aria-hidden="true">→</span></Link>}</div>
    {latest ? <>
      <section className="feature panel">
        <div><p className="eyebrow icon-text"><Icon name="message" /> {latest.state === 'needs_detail' || latest.state === 'draft' ? 'What needs your attention' : 'Latest report'}</p><Badge state={latest.state} /><h2>{latest.sender || 'Unidentified sender'}</h2><p className="muted">{shortId(latest.id)} · {channels[latest.channel]}</p></div>
        <Link className="primary" href={'/?case=' + latest.id}>{latest.state === 'draft' ? 'Continue draft' : latest.state === 'needs_detail' ? 'Add a detail' : 'View report'}</Link>
      </section>
      <section className="panel" aria-labelledby="reports-title"><h2 id="reports-title">Case history <span className="count">{reports.length}</span></h2>
        <ul className="rows">{reports.map(report => <li key={report.id}>
          <Link href={'/?case=' + report.id}><div><strong>{report.sender || 'Unidentified sender'}</strong><p>{shortId(report.id)} · {channels[report.channel]}</p></div><Badge state={report.state} /></Link>
        </li>)}</ul>
      </section>
    </> : <section className="panel empty"><span className="mark" aria-hidden="true">+</span><h2>Start with what you know</h2><p className="muted">A description is enough to get started, even if you don’t know who sent the message or when it arrived.</p><Link className="primary" href="/?view=new">Check a message</Link></section>}
  </>;
}

function DraftForm({ report }: { report?: Case }) {
  return <section className="panel" aria-labelledby="draft-title">
    <h2 id="draft-title">{report ? 'Edit your draft' : 'Tell us what happened'}</h2>
    <p className="muted">Use a fictional example. Leave out contact details, ID numbers and information about other people.</p>
    <form action={updateReport} className="form-stack">
      <input type="hidden" name="id" value={report?.id ?? newReportId()} />
      <input type="hidden" name="operation" value="save" />
      {report && <input type="hidden" name="revision" value={report.revision} />}
      <div className="field-pair">
        <label>How did it arrive?<select name="channel" defaultValue={report?.channel ?? 'sms'}>{Object.entries(channels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>Sender <span className="muted">· optional</span><input name="sender" maxLength={120} placeholder="e.g. Northstar Demo" defaultValue={report?.sender} /></label>
      </div>
      <div className="field-pair">
        <label>When did it arrive?<input type="date" name="received_on" defaultValue={report?.received_on ?? ''} /><span className="muted help">Leave blank if you’re unsure.</span></label>
        <label>What would you like to do?<select name="goal" defaultValue={report?.goal ?? 'unsure'}>{Object.entries(goals).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      </div>
      <label>Describe the call or message<textarea name="description" required minLength={10} maxLength={2000} rows={5} defaultValue={report?.description} placeholder="A caller from a fictional company offered me a loan after I asked them to stop." /></label>
      <div className="form-end"><button className="primary">Save draft</button><span className="muted">You can review it before submitting.</span></div>
    </form>
  </section>;
}

function StaffQueue({ tasks }: { tasks: QueueTask[] }) {
  const groups = [
    { name: 'Unassigned intake', items: tasks.filter(task => task.state === 'unassigned') },
    { name: 'My review tasks', items: tasks.filter(task => task.state === 'assigned') },
  ];
  return <>
    <div className="heading"><div><p className="eyebrow">Operations</p><h1>Work queue</h1><p className="lede">Claim a report to see its details and decide what the consumer needs next.</p></div></div>
    <div className="queue-grid">{groups.map(group => <section key={group.name} className="panel queue">
      <h2>{group.name} <span className="count">{group.items.length}</span></h2>
      {group.items.length ? <ul className="rows">{group.items.map(task => <li key={task.case_id}>
        <div className="task-row"><div><strong>{shortId(task.case_id)}</strong><p>{task.case_state === 'needs_detail' ? 'Waiting for consumer' : task.case_state ? status[task.case_state] : task.returned_at ? 'Returned for review' : 'Description only'}</p></div>
          {task.state === 'unassigned' ? <form action={updateReport}>
            <input type="hidden" name="id" value={task.case_id} /><input type="hidden" name="operation" value="claim" />
            <button className="secondary" aria-label={'Claim ' + shortId(task.case_id)}>Claim</button>
          </form> : <Link className="secondary" href={'/?case=' + task.case_id}>Open</Link>}
        </div>
      </li>)}</ul> : <p className="muted">No tasks in this group.</p>}
    </section>)}</div>
  </>;
}

function ActionForm({ report, operation, button, children }: { report: Case; operation: string; button: string; children?: React.ReactNode }) {
  return <form action={updateReport} className="form-stack">
    <input type="hidden" name="id" value={report.id} />
    <input type="hidden" name="revision" value={report.revision} />
    <input type="hidden" name="operation" value={operation} />
    {children}<div><button className="primary">{button}</button></div>
  </form>;
}

function CaseView({ report, timeline, actor }: { report: Case; timeline: CaseEvent[]; actor: Actor }) {
  return <>
    <div className="case-links"><Link href="/?view=home" className="back">← {actor.role === 'staff' ? 'Work queue' : 'My cases'}</Link>
      {actor.role === 'consumer' && <Link className="back" href={'/?view=privacy&scope=' + report.id}>Privacy controls</Link>}
    </div>
    <div className="heading"><div><p className="eyebrow">{shortId(report.id)} · {channels[report.channel]}</p><h1>{report.sender || 'Unidentified sender'}</h1></div><Badge state={report.state} staff={actor.role === 'staff'} /></div>
    <div className="case-grid">
      <div className="stack">
        {report.state === 'draft' ? <>
          <section className="panel feature"><div><h2>Your draft is saved</h2><p className="muted">Submitting sends it to PrivacyGuard for review.</p></div><ActionForm report={report} operation="submit" button="Submit for review" /></section>
          <DraftForm report={report} />
        </> : <>
          <section className="panel"><h2>Report details</h2>
            <dl className="facts"><div><dt>Date received</dt><dd>{receivedDate(report.received_on)}</dd></div><div><dt>Goal</dt><dd>{goals[report.goal]}</dd></div></dl>
            <p className="description">{report.description}</p>
            {report.receipt_at && <p className="muted help">Received by PrivacyGuard · {timeFormat.format(report.receipt_at)} EAT</p>}
          </section>
          {report.followups.length > 0 && <section className="panel"><h2>Additional details</h2>
            <dl className="followups">{report.followups.map((item, index) => <div key={index}><dt>{item.question}</dt><dd>{item.reply}</dd></div>)}</dl>
          </section>}
          {report.state === 'needs_detail' && <section className="panel feature-block"><p className="eyebrow">One more detail</p><h2>{report.detail_prompt}</h2>
            {actor.role === 'consumer' ? <ActionForm report={report} operation="detail" button="Send detail"><label>Your reply<textarea name="detail" rows={3} required minLength={10} maxLength={500} /></label></ActionForm>
              : <p className="muted">Waiting for the consumer’s reply.</p>}
          </section>}
          {report.state === 'in_review' && actor.role === 'staff' && <section className="panel"><h2>Record your review</h2>
            <p className="muted">Ask one specific question if something is missing. Otherwise, mark the intake screening complete.</p>
            <ActionForm report={report} operation="ask" button="Ask for a detail"><label>Question for the consumer<textarea name="prompt" rows={3} required minLength={10} maxLength={500} /></label></ActionForm>
            <div className="separator"><ActionForm report={report} operation="complete" button="Complete screening" /></div>
          </section>}
          {report.state === 'reviewed' && <section className="panel feature-block"><h2>Intake screening is complete</h2><p className="muted">This records the PrivacyGuard review of your report.</p></section>}
          {actor.role === 'staff' && (report.state === 'in_review' || report.state === 'needs_detail') &&
            <section className="panel"><details><summary>Return this task to the work queue</summary>
              <p className="muted">Another reviewer can claim it. You will lose access to this case. Any question awaiting the consumer’s reply stays open.</p>
              <ActionForm report={report} operation="return" button="Return task">
                <label>Reason for returning<select name="reason" required defaultValue=""><option value="" disabled>Choose a reason</option>
                  {Object.entries(returnReasons).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select></label>
              </ActionForm>
            </details></section>}
        </>}
      </div>
      <section className="panel timeline"><p className="eyebrow">Case activity</p><h2>What happened</h2><ol>{timeline.map((event, index) => <li key={index}><strong>{event.kind === 'detail_added' && actor.role === 'staff' ? 'Consumer added a detail' : events[event.kind]}</strong>{actor.role === 'staff' && event.return_reason && <span>{returnReasons[event.return_reason]}</span>}<span>{timeFormat.format(event.happened_at)} EAT</span></li>)}</ol></section>
    </div>
  </>;
}

function Help() {
  return <><div className="heading"><div><p className="eyebrow icon-text"><Icon name="help" /> Help</p><h1>How it works</h1><p className="lede">Start with what you know and return when you’re ready.</p></div></div>
    <div className="stack">
      <section className="panel"><h2>Can I start without a screenshot?</h2><p>A short description is enough to save a report. Add the sender and date if you know them.</p></section>
      <section className="panel"><h2>What happens when I submit?</h2><p>Your report goes to the PrivacyGuard review queue. The case history shows when it is received, assigned or needs a detail from you.</p></section>
      <section className="panel"><h2>Where can I manage my information?</h2><p>Open Privacy and choose your report to request a copy or ask for deletion review.</p><Link className="secondary" href="/?view=privacy">Open Privacy</Link></section>
    </div></>;
}

type Params = { view?: string; case?: string; scope?: string; message?: string };

export default async function Home({ searchParams }: { searchParams: Promise<Params> }) {
  const actor = await currentActor();
  if (!actor) return <Landing />;
  const params = await searchParams;
  const db = await store();
  let body: React.ReactNode;
  let page: ConsumerPage = 'home';
  if (actor.role === 'privacy') {
    body = <PrivacyQueue requests={await db.privacyRequests(actor)} />;
  } else if (params.case) {
    let detail = null;
    try { detail = await db.getCase(actor, readId(params.case)); } catch (error) {
      if (!(error instanceof Error) || error.message !== 'That report is unavailable.') throw error;
    }
    body = detail ? <CaseView {...detail} actor={actor} /> : <section className="panel empty"><h1>Report unavailable</h1><Link className="secondary" href="/?view=home">Back to workspace</Link></section>;
  } else if (actor.role === 'staff') {
    body = <StaffQueue tasks={await db.queue(actor)} />;
  } else if (params.view === 'new') {
    page = 'new';
    body = <><Link className="back" href="/?view=home">← My cases</Link><div className="heading"><div><p className="eyebrow">New report</p><h1>Check a message</h1></div></div><DraftForm /></>;
  } else if (params.view === 'privacy') {
    page = 'privacy';
    const [reports, requests] = await Promise.all([db.listCases(actor), db.privacyRequests(actor)]);
    body = <PrivacyCenter reports={reports} requests={requests} scope={params.scope} />;
  } else if (params.view === 'help') {
    page = 'help';
    body = <Help />;
  } else {
    body = <ConsumerHome reports={await db.listCases(actor)} />;
  }
  return <Frame actor={actor} page={page}>{params.message && <p className="notice" role="alert">{String(params.message).slice(0, 180)}</p>}{body}</Frame>;
}
