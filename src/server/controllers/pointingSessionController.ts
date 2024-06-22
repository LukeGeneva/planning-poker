import {
  castVote,
  createPointingSession,
  joinPointingSession,
  viewPointingSession,
} from '../compositionRoot';
import { renderToString } from 'react-dom/server';
import { PointingSession, renderParticipants } from '../pages/pointing-session';
import { CookieJar } from '../CookieJar';
import { Join } from '../pages/join';
import type { Server } from 'bun';

async function get(req: Request) {
  const url = new URL(req.url);
  const pointingSessionId = url.pathname.split('/')[2];
  const cookies = new CookieJar(req.headers.get('Cookie'));
  if (!cookies.exists('participant'))
    return Response.redirect(`/pointing-session/${pointingSessionId}/join`);

  const viewer = cookies.get('participant');
  const output = await viewPointingSession.execute({
    pointingSessionId,
  });
  return new Response(renderToString(PointingSession(output, viewer)), {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function post() {
  const output = await createPointingSession.execute();
  return Response.redirect(
    `/pointing-session/${output.pointingSessionId}/join`
  );
}

async function postParticipant(req: Request) {
  const url = new URL(req.url);
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

async function getJoin(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.pathname.split('/')[2];
  return new Response(renderToString(Join(sessionId)), {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function postVote(req: Request, server: Server) {
  const url = new URL(req.url);
  const pointingSessionId = url.pathname.split('/')[2];
  const cookies = new CookieJar(req.headers.get('Cookie'));
  const participant = cookies.get('participant');
  const formData = await req.formData();
  const points = Number.parseInt(formData.get('points')?.toString() || '0', 10);
  await castVote.execute({ pointingSessionId, participant, points });
  const viewOutput = await viewPointingSession.execute({ pointingSessionId });
  for (const p of viewOutput.participants) {
    const data = {
      type: 'STATE_CHANGED',
      html: renderToString(renderParticipants(viewOutput, p.participant)),
    };
    server.publish(
      `${pointingSessionId}-${p.participant}`,
      JSON.stringify(data)
    );
  }
  return Response.redirect(`/pointing-session/${pointingSessionId}`);
}

export const pointingSessionController = {
  get,
  post,
  postParticipant,
  getJoin,
  postVote,
};
