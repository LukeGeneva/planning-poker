import { renderToString } from 'react-dom/server';
import { Home } from './components/Home';
import { MemoryPointingSessionRepository } from './adapters/MemoryPointingSessionRepository';
import { CreatePointingSessionUseCase } from './use-cases/CreatePointingSessionUseCase';
import { ViewPointingSessionUseCase } from './use-cases/ViewPointingSession';
import { PointingSession } from './components/PointingSession';
import { SetName } from './components/SetName';
import { JoinPointingSessionUseCase } from './use-cases/JoinPointingSessionUseCase';

const pointingSessionRepository = new MemoryPointingSessionRepository();
const createPointingSession = new CreatePointingSessionUseCase(
  pointingSessionRepository
);
const viewPointingSession = new ViewPointingSessionUseCase(
  pointingSessionRepository
);
const joinPointingSession = new JoinPointingSessionUseCase(
  pointingSessionRepository
);

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
      return Response.redirect(`/pointing-session/${sessionId}`);
    }

    if (url.pathname.startsWith('/pointing-session') && req.method === 'GET') {
      const sessionId = url.pathname.split('/')[2];
      const output = await viewPointingSession.execute(sessionId);
      return new Response(renderToString(PointingSession(output)), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (url.pathname === '/socket') {
      if (server.upgrade(req)) {
        return; // do not return a Response
      }
      return new Response('Upgrade failed', { status: 500 });
    }

    return new Response('404!');
  },
  websocket: {
    open(ws) {
      console.log('OPEN', ws);
    },
    close(ws) {
      // console.log('CLOSE', ws);
    },
    message(ws, message) {
      // console.log('MESSAGE', message);
    },
  },
});
