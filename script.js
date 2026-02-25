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

        const C4_FREQ = 261.63; // Hz
        const simplifiedNotes = [];

        // Loop through all tracks and notes
        json.tracks.forEach(track => {
          track.notes.forEach(note => {
            // Convert MIDI note to frequency
            const freq = 440 * Math.pow(2, (note.midi - 69) / 12);
            // Normalize to C4
            const pitch = freq / C4_FREQ;
            // Use note.time for start time
            simplifiedNotes.push({
              pitch: pitch,
              time: note.time || 0
            });
          });
        });

        // Output as JSON
        outputDiv.textContent = JSON.stringify(simplifiedNotes, null, 2);

      } catch (err) {
        outputDiv.textContent = 'Error: ' + err.message;
      }
    };

    reader.readAsArrayBuffer(file);
  });
});