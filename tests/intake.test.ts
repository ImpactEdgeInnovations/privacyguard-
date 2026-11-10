import assert from 'node:assert/strict';
import { test } from 'node:test';
import { newReportId, openStore, personas, readDraft } from '../lib/intake.ts';

test('intake receipt, ownership, reviewer claim and follow-up use persisted state', async () => {
  const db = await openStore('memory://');
  try {
    const id = newReportId();
    const draft = {
      channel: 'call' as const,
      sender: 'Northstar Demo',
      received_on: '2026-11-09',
      goal: 'stop' as const,
      description: 'A fictional caller offered a loan after I asked them to stop. '.padEnd(2000, 'x'),
    };
    await db.saveDraft(personas.a, id, null, draft);
    await db.saveDraft(personas.a, id, null, draft);
    assert.equal((await db.getCase(personas.a, id))?.timeline.length, 1);
    assert.equal((await db.getCase(personas.a, id))?.report.received_on, draft.received_on);
    assert.equal((await db.getCase(personas.a, id))?.report.goal, 'stop');
    assert.equal(await db.getCase(personas.b, id), null);
    assert.equal(await db.getCase(personas.reviewer, id), null);
    assert.deepEqual(await db.queue(personas.reviewer), []);
    await assert.rejects(db.submit(personas.a, id, 2), /has changed/);

    const receipts = await Promise.all([db.submit(personas.a, id, 1), db.submit(personas.a, id, 1)]);
    assert.equal(receipts[0].toISOString(), receipts[1].toISOString());
    const queue = await db.queue(personas.reviewer);
    assert.equal(queue.length, 1);
    assert.equal(queue[0].case_state, null);
    assert.equal(await db.getCase(personas.reviewer, id), null);

    const claims = await Promise.allSettled([db.claim(personas.reviewer, id), db.claim(personas.backup, id)]);
    assert.equal(claims.filter(result => result.status === 'fulfilled').length, 1);
    const winner = claims[0].status === 'fulfilled' ? personas.reviewer : personas.backup;
    const other = winner === personas.reviewer ? personas.backup : personas.reviewer;
    assert.equal(await db.getCase(other, id), null);
    assert.deepEqual(await db.queue(other), []);
    assert.equal((await db.getCase(winner, id))?.report.state, 'in_review');

    await db.review(winner, id, 1, 'detail', 'What made you think the call came from Northstar Demo?');
    assert.equal((await db.getCase(personas.a, id))?.report.state, 'needs_detail');
    await assert.rejects(db.addDetail(personas.b, id, 2, 'A separate fictional consumer.'), /has changed/);
    await db.addDetail(personas.a, id, 2, 'The caller gave that name at the start.');
    assert.equal((await db.queue(winner))[0]?.case_state, 'in_review');
    await db.review(winner, id, 3, 'reviewed', '');
    const completed = await db.getCase(personas.a, id);
    assert.equal(completed?.report.state, 'reviewed');
    assert.equal(completed?.report.description, draft.description);
    assert.deepEqual(completed?.report.followups, [{
      question: 'What made you think the call came from Northstar Demo?',
      reply: 'The caller gave that name at the start.',
    }]);
    assert.deepEqual(completed?.timeline.map(event => event.kind),
      ['saved', 'submitted', 'claimed', 'asked_detail', 'detail_added', 'reviewed']);
    assert.deepEqual(await db.queue(winner), []);
    assert.equal((await db.submit(personas.a, id, 1)).toISOString(), receipts[0].toISOString());
  } finally {
    await db.close();
  }
});

test('fictional session is revocable and form keeps an unknown date separate', async () => {
  const db = await openStore('memory://');
  try {
    const session = await db.issueSession(personas.b);
    assert.equal((await db.session(session))?.id, personas.b.id);
    await db.revokeSession(session);
    assert.equal(await db.session(session), undefined);
    const form = new FormData();
    form.set('channel', 'sms');
    form.set('goal', 'unsure');
    form.set('description', 'A fictional example with an unknown date.');
    assert.equal(readDraft(form).received_on, null);
    form.set('received_on', '2026-02-30');
    assert.throws(() => readDraft(form), /valid date/);
  } finally {
    await db.close();
  }
});

test('privacy requests stay case-scoped and only a privacy reviewer can take them', async () => {
  const db = await openStore('memory://');
  try {
    const id = newReportId();
    await db.saveDraft(personas.a, id, null, {
      channel: 'sms', sender: 'Northstar Demo', received_on: null,
      goal: 'unsure', description: 'A fictional text offered a loan.',
    });

    await assert.rejects(db.requestPrivacy(personas.b, id, 'copy'), /unavailable/);
    const [first, replay] = await Promise.all([
      db.requestPrivacy(personas.a, id, 'copy'),
      db.requestPrivacy(personas.a, id, 'copy'),
    ]);
    assert.equal(first, replay);
    const deletion = await db.requestPrivacy(personas.a, id, 'deletion');
    assert.notEqual(first, deletion);
    assert.deepEqual(await db.privacyRequests(personas.b), []);
    assert.throws(() => db.privacyRequests(personas.reviewer), /separate role/);
    assert.throws(() => db.claimPrivacy(personas.reviewer, first), /unavailable/);
    assert.equal(await db.getCase(personas.privacy, id), null);

    const queue = await db.privacyRequests(personas.privacy);
    assert.equal(queue.length, 2);
    assert.equal(queue.find(request => request.id === first)?.claimed_at, null);
    await db.claimPrivacy(personas.privacy, first);
    await assert.rejects(db.claimPrivacy(personas.privacy, first), /already assigned/);
    const visible = await db.privacyRequests(personas.a);
    assert.ok(visible.find(request => request.id === first)?.claimed_at instanceof Date);
    assert.equal(visible.find(request => request.id === deletion)?.claimed_at, null);
    assert.equal((await db.getCase(personas.a, id))?.report.state, 'draft');
  } finally {
    await db.close();
  }
});

test('reviewed copy access and sandbox removal respect case scope and a retention hold', async () => {
  const db = await openStore('memory://');
  try {
    const id = newReportId();
    const draft = {
      channel: 'sms' as const, sender: 'Synthetic Copy', received_on: null,
      goal: 'stop' as const, description: 'A fictional marketing text.',
    };
    await db.saveDraft(personas.a, id, null, draft);
    await db.submit(personas.a, id, 1);
    const unrelated = newReportId();
    await db.saveDraft(personas.b, unrelated, null, { ...draft, sender: 'Separate fixture' });
    const copy = await db.requestPrivacy(personas.a, id, 'copy');
    const deletion = await db.requestPrivacy(personas.a, id, 'deletion');

    assert.equal(await db.caseCopy(personas.a, copy), null);
    await assert.rejects(db.decidePrivacy(personas.privacy, copy, 'release_copy'), /Take the request/);
    assert.throws(() => db.decidePrivacy(personas.reviewer, deletion, 'remove'), /unavailable/);
    await db.claimPrivacy(personas.privacy, copy);
    await db.claimPrivacy(personas.privacy, deletion);
    await db.decidePrivacy(personas.privacy, copy, 'release_copy');
    const download = await db.caseCopy(personas.a, copy);
    assert.equal(download?.id, id);
    assert.equal((download?.data as { reportedSender: string }).reportedSender, 'Synthetic Copy');
    assert.ok(!JSON.stringify(download).includes('Separate fixture'));
    assert.equal(await db.caseCopy(personas.b, copy), null);
    assert.equal(await db.caseCopy(personas.a, deletion), null);
    assert.throws(() => db.caseCopy(personas.privacy, copy), /unavailable/);

    await db.decidePrivacy(personas.privacy, deletion, 'hold', 'Synthetic review reason.', '2099-01-01');
    await assert.rejects(db.decidePrivacy(personas.privacy, deletion, 'remove'), /Resolve the hold/);
    assert.equal((await db.privacyRequests(personas.a)).find(request => request.id === deletion)?.outcome, 'held');
    assert.ok(await db.getCase(personas.a, id));
    await db.decidePrivacy(personas.privacy, deletion, 'release_hold');
    await db.decidePrivacy(personas.privacy, deletion, 'remove');
    assert.equal(await db.caseCopy(personas.a, copy), null);
    assert.equal(await db.getCase(personas.a, id), null);
    assert.deepEqual(await db.queue(personas.reviewer), []);
    assert.ok(await db.getCase(personas.b, unrelated));
    assert.equal((await db.privacyRequests(personas.a)).find(request => request.id === copy)?.outcome, 'copy_unavailable');
    assert.equal((await db.privacyRequests(personas.a)).find(request => request.id === deletion)?.outcome, 'removed');
    await assert.rejects(db.saveDraft(personas.a, id, null, draft), /unavailable/);
  } finally {
    await db.close();
  }
});
