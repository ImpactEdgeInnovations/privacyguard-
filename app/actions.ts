'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { currentActor, localEnabled, sessionCookie, store } from '../lib/local';
import { personas, privacyKinds, readDraft, readId, readRevision, WorkflowError, type PrivacyKind } from '../lib/intake';

export async function signIn(form: FormData) {
  if (!localEnabled()) redirect('/');
  const choice = String(form.get('persona') ?? '');
  if (!Object.hasOwn(personas, choice)) redirect('/');
  const jar = await cookies();
  const db = await store();
  await db.revokeSession(jar.get(sessionCookie)?.value);
  const token = await db.issueSession(personas[choice as keyof typeof personas]);
  jar.set(sessionCookie, token, { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60 });
  redirect('/?view=home');
}

export async function signOut() {
  const jar = await cookies();
  if (localEnabled()) await (await store()).revokeSession(jar.get(sessionCookie)?.value);
  jar.delete(sessionCookie);
  redirect('/');
}

export async function updatePrivacyRequest(form: FormData) {
  const actor = await currentActor();
  if (!actor) redirect('/');
  const target = new URLSearchParams({ view: actor.role === 'privacy' ? 'home' : 'privacy' });
  try {
    const db = await store();
    if (actor.role === 'privacy') {
      const id = readId(form.get('id'));
      const action = form.get('action');
      if (action === 'claim') {
        await db.claimPrivacy(actor, id);
      } else if (action === 'release_copy' || action === 'hold' || action === 'release_hold' || action === 'remove') {
        if (action === 'remove' && form.get('confirmed') !== 'on') {
          throw new WorkflowError('Confirm the removal of this fictional case.');
        }
        await db.decidePrivacy(actor, id, action, String(form.get('note') ?? '').trim(), String(form.get('reviewOn') ?? ''));
      } else {
        throw new WorkflowError('Choose an available review action.');
      }
    } else {
      const scope = readId(form.get('caseId'));
      const kind = String(form.get('kind') ?? '');
      if (!Object.hasOwn(privacyKinds, kind)) throw new WorkflowError('Choose an available request.');
      await db.requestPrivacy(actor, scope, kind as PrivacyKind);
      target.set('scope', scope);
    }
  } catch (error) {
    if (!(error instanceof WorkflowError)) throw error;
    target.set('message', error.message);
  }
  redirect('/?' + target.toString());
}

export async function updateReport(form: FormData) {
  const actor = await currentActor();
  if (!actor) redirect('/');
  let target = '/?view=home';
  let id: string | undefined;
  const action = String(form.get('operation') ?? '');
  try {
    id = readId(form.get('id'));
    const db = await store();
    if (action === 'save') {
      const revision = form.get('revision');
      await db.saveDraft(actor, id, revision ? readRevision(revision) : null, readDraft(form));
    } else if (action === 'claim') {
      await db.claim(actor, id);
    } else {
      const revision = readRevision(form.get('revision'));
      if (action === 'submit') {
        await db.submit(actor, id, revision);
      } else if (action === 'detail') {
        await db.addDetail(actor, id, revision, String(form.get('detail') ?? '').trim());
      } else if (action === 'ask' || action === 'complete') {
        await db.review(actor, id, revision, action === 'ask' ? 'detail' : 'reviewed', String(form.get('prompt') ?? '').trim());
      } else {
        throw new WorkflowError('Choose an available action.');
      }
    }
    target = '/?case=' + id;
  } catch (error) {
    if (!(error instanceof WorkflowError)) throw error;
    const params = new URLSearchParams();
    if (action === 'save' && !form.get('revision')) params.set('view', 'new');
    else if (id && action !== 'claim') params.set('case', id);
    else params.set('view', 'home');
    params.set('message', error.message);
    target = '/?' + params.toString();
  }
  redirect(target);
}
