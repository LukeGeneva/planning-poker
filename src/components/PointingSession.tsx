import type { ViewPointingSessionOutput } from '../use-cases/ViewPointingSession';
import { Layout } from './Layout';

export function PointingSession(
  viewPointingSessionOutput: ViewPointingSessionOutput
) {
  return (
    <Layout>
      <h1>Session {viewPointingSessionOutput.id}</h1>
      <ul>
        {viewPointingSessionOutput.participants.map((p) => (
          <li>{p}</li>
        ))}
      </ul>
    </Layout>
  );
}
