import type { ViewPointingSessionOutput } from '../../use-cases/ViewPointingSessionUseCase';

const pointOptions = [0, 1, 2, 3, 5, 13, 21];

export function PointingSession(
  viewPointingSessionOutput: ViewPointingSessionOutput
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
        <ul>
          {viewPointingSessionOutput.participants.map((p) => (
            <li key={p.participant}>
              {p.participant} {p.vote || ''}{' '}
              <span id={`${p.participant}HasVoted`} hidden={p.vote === null}>
                X
              </span>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
