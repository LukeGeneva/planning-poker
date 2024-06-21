const pointingSessionId = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
  const socket = new WebSocket(
    `ws://localhost:3000/${pointingSessionId}/socket?cookie=${document.cookie}`
  );

  socket.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'VOTE') updateParticipantVote(data.participant);
  });

  document
    .querySelectorAll('button[name="points"]')
    .forEach((b) => b.addEventListener('click', handleVote));
});

function handleVote(e) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/pointing-session/${pointingSessionId}/vote`, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  const formData = { points: e.target.value };
  const encodedData = new URLSearchParams(formData).toString();
  xhr.send(encodedData);
}

function updateParticipantVote(participant) {
  const span = document.getElementById(`${participant}HasVoted`);
  span.hidden = false;
}
