document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('participant');

  nameInput.addEventListener('input', (e) => {
    localStorage.setItem('participant', e.target.value);
  });
});
