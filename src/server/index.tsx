import type { ServerWebSocket } from 'bun';
import { renderToString } from 'react-dom/server';
import { PointingSession } from './pages/pointing-session';
import { Home } from './pages/home';
import { SetName } from './pages/set-name';
import { CookieJar } from './CookieJar';
import {
  castVote,
  createPointingSession,
  joinPointingSession,
  viewPointingSession,
} from './compositionRoot';
import type { PointingSessionSocketData } from './PointingSessionSocketData';
import { pointingSessionController } from './controllers/pointingSessionController';

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

    if (url.pathname === '/pointing-session' && req.method === 'POST') {
      const output = await createPointingSession.execute();
      return Response.redirect(
        `/pointing-session/${output.pointingSessionId}/join`
      );
    }

    if (
      url.pathname.startsWith('/pointing-session') &&
      url.pathname.endsWith('/join') &&
      req.method === 'GET'
    ) {
      const sessionId = url.pathname.split('/')[2];
      return new Response(renderToString(SetName(sessionId)), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (
      url.pathname.startsWith('/pointing-session') &&
      url.pathname.endsWith('/join') &&
      req.method === 'POST'
    ) {
      const sessionId = url.pathname.split('/')[2];
      const data = await req.formData();
      const participant = data.get('participant')?.toString() || '';
      await joinPointingSession.execute({
        pointingSessionId: sessionId,
        participantName: participant,
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/pointing-session/${sessionId}`,
          'Set-Cookie': `participant=${participant}`,
        },
      });
    }

    if (url.pathname.startsWith('/pointing-session') && req.method === 'GET')
      return pointingSessionController.get(req);

    if (
      req.method === 'POST' &&
      url.pathname.startsWith('/pointing-session') &&
      url.pathname.endsWith('vote')
    ) {
      const pointingSessionId = url.pathname.split('/')[2];
      const cookies = new CookieJar(req.headers.get('Cookie'));
      const participant = cookies.get('participant');
      const formData = await req.formData();
      const points = Number.parseInt(
        formData.get('points')?.toString() || '0',
        10
      );
      await castVote.execute({ pointingSessionId, participant, points });
      const data = { type: 'VOTE', participant };
      server.publish(pointingSessionId, JSON.stringify(data));
      return Response.redirect(`/pointing-session/${pointingSessionId}`);
    }

    if (url.pathname.endsWith('/socket')) {
      const pointingSessionId = url.pathname.split('/')[1];
      const cookie = new URL(req.url).searchParams.get('cookie');
      const cookies = new CookieJar(cookie);
      const participant = cookies.get('participant');
      console.log(participant);
      if (server.upgrade(req, { data: { pointingSessionId, participant } })) {
        return; // do not return a Response
      }
      return new Response('Upgrade failed', { status: 500 });
    }

    return new Response('404!');
  },
  websocket: {
    open(socket: ServerWebSocket<PointingSessionSocketData>) {
      const { pointingSessionId, participant } = socket.data;
      socket.subscribe(pointingSessionId);
      const data = { type: 'USER_JOINED', participant };
      server.publish(pointingSessionId, JSON.stringify(data));
    },
    close(socket: ServerWebSocket<PointingSessionSocketData>) {
      socket.unsubscribe(socket.data.pointingSessionId);
    },
    message(ws, message) {
      console.log('MESSAGE', message);
    },
  },
});

console.log('Server listening on port 3000.');
