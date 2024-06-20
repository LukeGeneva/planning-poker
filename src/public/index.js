console.log('Hello World!');
const socket = new WebSocket('ws://localhost:3000/socket');

console.log(localStorage.getItem('participant'));

socket.addEventListener('open', (event) => {
  socket.send('Test');
});

document.addEventListener('DOMContentLoaded', () => {
  const participantInput = document.getElementById('participant');

  if (participantInput) {
    participantInput.addEventListener('input', (e) => {
      localStorage.setItem('participant', e.target.value);
    });
  }
});
