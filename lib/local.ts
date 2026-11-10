import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { cookies } from 'next/headers';
import { openStore, type IntakeStore } from './intake';

export const sessionCookie = 'pg_local_session';

const globalStore = globalThis as typeof globalThis & { privacyGuardStore?: Promise<IntakeStore> };

export function localEnabled() {
  return process.env.PRIVACYGUARD_LOCAL === '1';
}

export function store() {
  if (!localEnabled()) throw new Error('The local development workspace is disabled.');
  if (!globalStore.privacyGuardStore) {
    const path = resolve(process.env.PRIVACYGUARD_DB_PATH ?? '.local-data/postgres');
    globalStore.privacyGuardStore = mkdir(dirname(path), { recursive: true })
      .then(() => openStore(path))
      .catch(error => {
        delete globalStore.privacyGuardStore;
        throw error;
      });
  }
  return globalStore.privacyGuardStore;
}

export async function currentActor() {
  if (!localEnabled()) return undefined;
  const token = (await cookies()).get(sessionCookie)?.value;
  return token ? (await store()).session(token) : undefined;
}
