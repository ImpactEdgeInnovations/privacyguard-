import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createPreviewClient } from './client';
import { previewSettings } from './policy';

export async function identityClient(writable: boolean) {
  const config = previewSettings(process.env, (await headers()).get('host'));
  if (!config) notFound();
  const jar = await cookies();
  const client = createPreviewClient(config, {
    getAll: () => jar.getAll(),
    // The route proxy refreshes before page rendering. Server Actions can persist auth changes.
    setAll: changes => {
      if (writable) changes.forEach(({ name, value, options }) => jar.set(name, value, options));
    },
  });
  return { client, issuer: config.issuer };
}
