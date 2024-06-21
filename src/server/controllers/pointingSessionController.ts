import { viewPointingSession } from '../compositionRoot';
import { renderToString } from 'react-dom/server';
import { PointingSession } from '../pages/pointing-session';

async function get(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.pathname.split('/')[2];
  const output = await viewPointingSession.execute(sessionId);
  return new Response(renderToString(PointingSession(output)), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export const pointingSessionController = {
  get,
};
