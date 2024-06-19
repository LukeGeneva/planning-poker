import { Layout } from './Layout';

export function Home() {
  return (
    <Layout>
      <h1>Planning Poker</h1>
      <form action="/pointing-session" method="POST">
        <button type="submit">New Pointing Session</button>
      </form>
    </Layout>
  );
}
