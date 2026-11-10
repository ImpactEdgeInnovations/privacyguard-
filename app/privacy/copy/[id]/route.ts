import { readId, WorkflowError } from '../../../../lib/intake';
import { currentActor, store } from '../../../../lib/local';

export const dynamic = 'force-dynamic';

const cacheHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
};

const unavailable = () => new Response('This case copy is unavailable.', { status: 404, headers: cacheHeaders });

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await currentActor();
  if (actor?.role !== 'consumer') return unavailable();
  let id: string;
  try {
    id = readId((await params).id);
  } catch (error) {
    if (!(error instanceof WorkflowError)) throw error;
    return unavailable();
  }

  const copy = await (await store()).caseCopy(actor, id);
  if (!copy) return unavailable();
  return Response.json(copy.data, {
    headers: {
      ...cacheHeaders,
      'Content-Disposition': 'attachment; filename="PrivacyGuard-PG-' + copy.id.slice(0, 8).toUpperCase() + '.json"',
    },
  });
}
