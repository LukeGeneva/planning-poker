export function Home() {
  return (
    <html>
      <head></head>
      <body>
        <h1>Planning Poker</h1>
        <form action="/pointing-session" method="POST">
          <button type="submit">New Pointing Session</button>
        </form>
      </body>
    </html>
  );
}
