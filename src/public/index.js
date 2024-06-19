console.log('Hello World!');
const socket = new WebSocket('ws://localhost:3000/socket');

socket.addEventListener('open', (event) => {
  socket.send('Test');
});
