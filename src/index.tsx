import { renderToString } from 'react-dom/server';
import { Home } from './components/Home';
import { MemoryPointingSessionRepository } from './adapters/MemoryPointingSessionRepository';
import { CreatePointingSessionUseCase } from './use-cases/CreatePointingSessionUseCase';

const pointingSessionRepository = new MemoryPointingSessionRepository();
const createPointingSession = new CreatePointingSessionUseCase(
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

    if (url.pathname === '/index.js')
      return new Response(Bun.file('./src/public/index.js'));

    if (url.pathname === '/pointing-session' && req.method === 'POST') {
      const output = await createPointingSession.execute();
      return Response.redirect(`/pointing-session/${output.pointingSessionId}`);
    }

    if (url.pathname.startsWith('/pointing-session') && req.method === 'GET') {
      const sessionId = url.pathname.split('/')[2];
      console.log('ID', sessionId);
      return Response.redirect('/');
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
      console.log('CLOSE', ws);
    },
    message(ws, message) {
      console.log('MESSAGE', message);
    },
  },
});
