import type { ViewPointingSessionOutput } from '../use-cases/ViewPointingSession';

export function PointingSession(
  viewPointingSessionOutput: ViewPointingSessionOutput
) {
  return (
    <html>
      <head>
        <title>Pointing Session</title>
      </head>
      <body>
        <h1>Session {viewPointingSessionOutput.id}</h1>
        <ul>
          {viewPointingSessionOutput.participants.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </body>
    </html>
  );
}
