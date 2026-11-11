import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newReportId, openStore, personas, type ReturnReason } from '../lib/intake.ts';

const draft = {
  channel: 'sms' as const, sender: 'Handoff fixture', received_on: null,
  goal: 'stop' as const, description: 'A fictional message used to verify reviewer handoff.',
};

test('returning an assigned task removes prior access and preserves an unanswered consumer question', async () => {
  const db = await openStore('memory://');
  try {
    const id = newReportId();
    await db.saveDraft(personas.a, id, null, draft);
    const receipt = await db.submit(personas.a, id, 1);
    await db.claim(personas.reviewer, id);
    const question = 'What name did the fictional sender use?';
    await db.review(personas.reviewer, id, 1, 'detail', question);
    const before = await db.getCase(personas.a, id);

    assert.throws(() => db.returnTask(personas.a, id, 2, 'availability'), /unavailable/);
    assert.throws(() => db.returnTask(personas.privacy, id, 2, 'availability'), /unavailable/);
    assert.throws(() => db.returnTask(personas.reviewer, id, 2, 'injected' as ReturnReason), /Choose why/);
    await assert.rejects(db.returnTask(personas.backup, id, 2, 'availability'), /unavailable/);
    await assert.rejects(db.returnTask(personas.reviewer, id, 1, 'availability'), /has changed/);
    assert.deepEqual(await db.getCase(personas.a, id), before);

    const returns = await Promise.allSettled([
      db.returnTask(personas.reviewer, id, 2, 'availability'),
      db.returnTask(personas.reviewer, id, 2, 'availability'),
    ]);
    assert.equal(returns.filter(result => result.status === 'fulfilled').length, 1);
    assert.equal(await db.getCase(personas.reviewer, id), null);
    assert.equal(await db.getCase(personas.backup, id), null);
    assert.equal(await db.getCase(personas.b, id), null);
    await assert.rejects(db.review(personas.reviewer, id, 3, 'reviewed', ''), /unavailable/);
    const routing = await db.queue(personas.backup);
    assert.equal(routing.length, 1);
    assert.equal(routing[0].state, 'unassigned');
    assert.equal(routing[0].case_state, null);
    assert.ok(routing[0].returned_at instanceof Date);
    assert.ok(!JSON.stringify(routing).includes(draft.description));
    const returned = await db.getCase(personas.a, id);
    assert.equal(returned?.report.revision, 3);
    assert.equal(returned?.report.state, 'needs_detail');
    assert.equal(returned?.report.detail_prompt, question);
    assert.deepEqual(returned?.timeline.filter(event => event.kind === 'returned').map(event => event.return_reason), ['availability']);

    await db.claim(personas.backup, id);
    assert.equal((await db.getCase(personas.backup, id))?.report.state, 'needs_detail');
    assert.equal((await db.getCase(personas.backup, id))?.report.detail_prompt, question);
    assert.equal(await db.getCase(personas.reviewer, id), null);
    await assert.rejects(db.returnTask(personas.reviewer, id, 3, 'other'), /unavailable/);
    await assert.rejects(db.review(personas.reviewer, id, 3, 'detail', 'A stale question from a former reviewer.'), /unavailable/);
    await db.addDetail(personas.a, id, 3, 'The fictional sender used the name Demo Northstar.');
    assert.equal((await db.queue(personas.backup))[0]?.case_state, 'in_review');
    await db.review(personas.backup, id, 4, 'reviewed', '');
    const finished = await db.getCase(personas.a, id);
    assert.equal(finished?.report.description, draft.description);
    assert.equal(finished?.report.receipt_at?.toISOString(), receipt.toISOString());
    assert.equal(finished?.report.followups[0].question, question);
    assert.deepEqual(finished?.timeline.map(event => event.kind),
      ['saved', 'submitted', 'claimed', 'asked_detail', 'returned', 'claimed', 'detail_added', 'reviewed']);
    await assert.rejects(db.returnTask(personas.backup, id, 5, 'expertise'), /unavailable/);
    assert.deepEqual(await db.queue(personas.backup), []);

    const copy = await db.requestPrivacy(personas.a, id, 'copy');
    await db.claimPrivacy(personas.privacy, copy);
    await db.decidePrivacy(personas.privacy, copy, 'release_copy');
    const content = (await db.caseCopy(personas.a, copy))?.data as { activity: { kind: string; returnReason: string | null }[] };
    assert.equal(content.activity.find(event => event.kind === 'returned')?.returnReason, 'availability');
  } finally {
    await db.close();
  }
});

test('replying while a task is unassigned survives a single winning claim and stale return forms', async () => {
  const db = await openStore('memory://');
  try {
    const id = newReportId();
    await db.saveDraft(personas.a, id, null, draft);
    await db.submit(personas.a, id, 1);
    await db.claim(personas.reviewer, id);
    await db.review(personas.reviewer, id, 1, 'detail', 'Which fictional channel did you receive it through?');
    await db.returnTask(personas.reviewer, id, 2, 'capacity');
    await db.addDetail(personas.a, id, 3, 'It came through a fictional SMS account.');
    const claims = await Promise.allSettled([db.claim(personas.backup, id), db.claim(personas.reviewer, id)]);
    assert.equal(claims.filter(result => result.status === 'fulfilled').length, 1);
    const winner = claims[0].status === 'fulfilled' ? personas.backup : personas.reviewer;
    const other = winner === personas.backup ? personas.reviewer : personas.backup;
    assert.equal(await db.getCase(other, id), null);
    assert.equal((await db.getCase(winner, id))?.report.followups.length, 1);
    assert.equal((await db.getCase(winner, id))?.report.state, 'in_review');
    await assert.rejects(db.returnTask(winner, id, 2, 'availability'), /has changed/);
    assert.equal((await db.getCase(winner, id))?.report.revision, 4);
    await db.returnTask(winner, id, 4, 'expertise');
    await db.claim(other, id);
    assert.equal(await db.getCase(winner, id), null);
    assert.deepEqual((await db.getCase(other, id))?.timeline.filter(event => event.kind === 'returned').map(event => event.return_reason), ['capacity', 'expertise']);
  } finally {
    await db.close();
  }
});

test('handoff history and access boundaries survive reopening the persisted sandbox', async () => {
  const path = await mkdtemp(join(tmpdir(), 'privacyguard-handoff-'));
  let db = await openStore(path);
  try {
    const id = newReportId();
    await db.saveDraft(personas.a, id, null, draft);
    await db.submit(personas.a, id, 1);
    await db.claim(personas.reviewer, id);
    await db.returnTask(personas.reviewer, id, 1, 'other');
    await db.close();
    db = await openStore(path);
    assert.equal(await db.getCase(personas.reviewer, id), null);
    assert.equal((await db.queue(personas.backup))[0]?.state, 'unassigned');
    assert.equal((await db.getCase(personas.a, id))?.timeline.at(-1)?.return_reason, 'other');
    await db.claim(personas.backup, id);
    assert.equal((await db.getCase(personas.backup, id))?.report.state, 'in_review');
  } finally {
    await db.close();
    await rm(path, { recursive: true, force: true });
  }
});
