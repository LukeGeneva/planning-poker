import { viewPointingSession } from '../compositionRoot';
import { renderToString } from 'react-dom/server';
import { PointingSession } from '../pages/pointing-session';
import { CookieJar } from '../CookieJar';

async function get(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.pathname.split('/')[2];
  const cookies = new CookieJar(req.headers.get('Cookie'));
  if (!cookies.exists('participant'))
    return Response.redirect(`/pointing-session/${sessionId}/join`);

  const output = await viewPointingSession.execute(sessionId);
  return new Response(renderToString(PointingSession(output)), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export const pointingSessionController = {
  get,
};
