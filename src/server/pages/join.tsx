export function Join(pointingSessionId: string) {
  return (
    <html>
      <head></head>
      <body>
        <form
          action={`/pointing-session/${pointingSessionId}/participant`}
          method="POST"
        >
          <input type="text" id="participant" name="participant" />
          <button type="submit">Join</button>
        </form>
      </body>
    </html>
  );
}
