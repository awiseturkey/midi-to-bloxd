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
            // Round to 3 decimal places
            pitch = Math.round(pitch * 1000) / 1000;
            let time = Math.round((note.time || 0) * 1000) / 1000;

            // Add pitch and time
            simplifiedNotes.push({
              p: pitch,
              t: time || 0
            });
          });
        });

        // Show the simplified JSON
        outputDiv.textContent = JSON.stringify(simplifiedNotes, null, 2);

      } catch (err) {
        outputDiv.textContent = 'Error: ' + err.message;
      }
    };

    reader.readAsArrayBuffer(file);
  });
});