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
        <form
          action={`/pointing-session/${viewPointingSessionOutput.id}/vote`}
          method="POST"
        >
          <ul>
            {pointOptions.map((points) => (
              <li key={`points-${points}`}>
                <button type="submit" name="points" value={points}>
                  {points}
                </button>
              </li>
            ))}
          </ul>
        </form>
        <ul>
          {viewPointingSessionOutput.participants.map((p) => (
            <li key={p.participant}>
              {p.participant} {p.vote || ''}
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
