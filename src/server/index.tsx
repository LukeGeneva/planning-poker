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
import { RoomCollection } from './RoomCollection';
import type { PointingSessionSocketData } from './PointingSessionSocketData';

const rooms = new RoomCollection();

Bun.serve({
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

    if (url.pathname.startsWith('/pointing-session') && req.method === 'GET') {
      const sessionId = url.pathname.split('/')[2];
      const output = await viewPointingSession.execute(sessionId);
      return new Response(renderToString(PointingSession(output)), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

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
      return Response.redirect(`/pointing-session/${pointingSessionId}`);
    }

    if (url.pathname.endsWith('/socket')) {
      const pointingSessionId = url.pathname.split('/')[1];
      if (server.upgrade(req, { data: { pointingSessionId } })) {
        return; // do not return a Response
      }
      return new Response('Upgrade failed', { status: 500 });
    }

    return new Response('404!');
  },
  websocket: {
    open(socket: ServerWebSocket<PointingSessionSocketData>) {
      rooms.joinOrCreate(socket);
    },
    close(socket: ServerWebSocket<PointingSessionSocketData>) {
      rooms.leave(socket);
    },
    message(ws, message) {
      console.log('MESSAGE', message);
    },
  },
});

console.log('Server listening on port 3000.');