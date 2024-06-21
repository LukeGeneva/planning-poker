import type { ViewPointingSessionOutput } from '../../use-cases/ViewPointingSessionUseCase';

const pointOptions = [0, 1, 2, 3, 5, 13, 21];

export function PointingSession(
  viewPointingSessionOutput: ViewPointingSessionOutput,
  viewer: string
) {
  return (
    <html>
      <head>
        <title>Pointing Session</title>
        <script type="text/javascript" src="/pointing-session.js"></script>
      </head>
      <body>
        <h1>Session {viewPointingSessionOutput.id}</h1>
        <input type="hidden" value="test" name="test" />
        <ul>
          {pointOptions.map((points) => (
            <li key={`points-${points}`}>
              <button type="button" name="points" value={points}>
                {points}
              </button>
            </li>
          ))}
        </ul>
        {renderParticipants(viewPointingSessionOutput, viewer)}
      </body>
    </html>
  );
}

export function renderParticipants(
  viewPointingSessionOutput: ViewPointingSessionOutput,
  viewer: string
) {
  return (
    <ul id="participants">
      {viewPointingSessionOutput.participants.map((p) => (
        <li key={p.participant}>
          {p.participant} {renderVote(viewer, p.participant, p.vote)}
        </li>
      ))}
    </ul>
  );
}

function renderVote(viewer: string, participant: string, vote: number | null) {
  if (vote === null) return '';
  if (viewer === participant) return vote.toString();
  return 'X';
}
