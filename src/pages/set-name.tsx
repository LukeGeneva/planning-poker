export function SetName(pointingSessionId: string) {
  return (
    <html>
      <head>
        <script type="text/javascript" src="/set-name.js"></script>
      </head>
      <body>
        <form
          action={`/pointing-session/${pointingSessionId}/join`}
          method="POST"
        >
          <input type="text" id="participant" name="participant" />
          <button type="submit">Join</button>
        </form>
      </body>
    </html>
  );
}
