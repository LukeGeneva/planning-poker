import { Layout } from './Layout';

export function SetName(pointingSessionId: string) {
  return (
    <Layout>
      <form
        action={`/pointing-session/${pointingSessionId}/join`}
        method="POST"
      >
        <input type="text" name="participant" />
        <button type="submit">Join</button>
      </form>
    </Layout>
  );
}
