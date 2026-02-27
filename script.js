window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('fileInput');
  const outputDiv = document.getElementById('output');

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const midi = new Midi(event.target.result);
        const json = midi.toJSON();

        const simplifiedNotes = [];

        // Loop through all tracks and notes
        json.tracks.forEach(track => {
          track.notes.forEach(note => {
            // Calculate pitch relative to C4 (MIDI 60)
            let pitch = Math.pow(2, (note.midi - 60) / 12);
            // Round to 2 decimal places
            pitch = Math.round(pitch * 100) / 100;
            let time = Math.round((note.time || 0) * 100) / 100;

            // Add pitch and time
            simplifiedNotes.push({
              p: pitch,
              t: time || 0
            });
            simplifiedNotes.sort((a, b) => a.t - b.t);
          });
        });

        // Show the simplified JSON
        outputDiv.textContent = JSON.stringify(simplifiedNotes);

      } catch (err) {
        outputDiv.textContent = 'Error: ' + err.message;
      }
    };

    reader.readAsArrayBuffer(file);
  });
});

// Copy button functionality
document.getElementById('copyBtn').addEventListener('click', () => {
  const output = document.getElementById('output');
  navigator.clipboard.writeText(output.textContent).then(() => {
    alert('Copied to clipboard!');
  }).catch(err => {
    // fallback if clipboard API isn't supported
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    alert('Copied to clipboard!');
  });
});

// Enable Ctrl + A and Ctrl + C for the output div
document.getElementById('output').addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    const output = document.getElementById('output');
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    document.execCommand('copy');
    alert('Copied to clipboard!');
  }
});

// Optional: focus the output div when clicked to enable shortcuts
document.getElementById('output').addEventListener('click', () => {
  document.getElementById('output').focus();
});