import type { ServerWebSocket } from 'bun';
import { renderToString } from 'react-dom/server';
import { Home } from './pages/home';
import { CookieJar } from './CookieJar';
import type { PointingSessionSocketData } from './PointingSessionSocketData';
import { pointingSessionController } from './controllers/pointingSessionController';
import { renderParticipants } from './pages/pointing-session';
import { viewPointingSession } from './compositionRoot';

const server = Bun.serve({
  port: 3000, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  async fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === '/')
      return new Response(renderToString(<Home />), {
        headers: { 'Content-Type': 'text/html' },
      });

    if (url.pathname.endsWith('.js'))
      return new Response(Bun.file(`./src/public${url.pathname}`));

    if (url.pathname === '/pointing-session' && req.method === 'POST')
      return pointingSessionController.post();

    if (
      url.pathname.startsWith('/pointing-session') &&
      url.pathname.endsWith('/join') &&
      req.method === 'GET'
    )
      return pointingSessionController.getJoin(req);

    if (url.pathname.startsWith('/pointing-session') && req.method === 'GET')
      return pointingSessionController.get(req);

    if (
      url.pathname.startsWith('/pointing-session') &&
      url.pathname.endsWith('/participant') &&
      req.method === 'POST'
    )
      return pointingSessionController.postParticipant(req);

    if (
      req.method === 'POST' &&
      url.pathname.startsWith('/pointing-session') &&
      url.pathname.endsWith('vote')
    )
      return pointingSessionController.postVote(req, server);

    if (url.pathname.endsWith('/socket')) {
      const pointingSessionId = url.pathname.split('/')[1];
      const cookie = new URL(req.url).searchParams.get('cookie');
      const cookies = new CookieJar(cookie);
      const participant = cookies.get('participant');
      if (server.upgrade(req, { data: { pointingSessionId, participant } })) {
        return; // do not return a Response
      }
      return new Response('Upgrade failed', { status: 500 });
    }

    return new Response(null, { status: 404 });
  },
  websocket: {
    async open(socket: ServerWebSocket<PointingSessionSocketData>) {
      const { pointingSessionId, participant } = socket.data;
      socket.subscribe(pointingSessionId);
      socket.subscribe(`${pointingSessionId}-${participant}`);
      const output = await viewPointingSession.execute({
        pointingSessionId,
      });
      for (const p of output.participants) {
        const data = {
          type: 'STATE_CHANGED',
          html: renderToString(renderParticipants(output, p.participant)),
        };
        server.publish(
          `${pointingSessionId}-${p.participant}`,
          JSON.stringify(data)
        );
      }
    },
    close(socket: ServerWebSocket<PointingSessionSocketData>) {
      socket.unsubscribe(socket.data.pointingSessionId);
    },
    message(ws, message) {
      throw new Error('Unexpected socket message.');
    },
  },
});

console.log('Server listening on port 3000.');
