document.addEventListener('DOMContentLoaded', () => {
  const pointingSessionId = window.location.pathname.split('/')[2];
  const socket = new WebSocket(
    `ws://localhost:3000/${pointingSessionId}/socket`
  );

  socket.addEventListener('open', () => {
    socket.send('Test', { test: 'test' });
  });
});
