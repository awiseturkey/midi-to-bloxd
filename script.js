document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const midi = new Midi(event.target.result);
      const json = midi.toJSON();

      // Convert note data to pitch values where C4 = 1.0
      const concertC = 261.63; // Hz
      const converted = json.tracks.map(track => ({
        ...track,
        notes: track.notes.map(note => {
          const freq = 440 * Math.pow(2, (note.midi - 69) / 12);
          return {
            ...note,
            pitch: freq / concertC // C4 = 1.0
          };
        })
      }));

      document.getElementById('output').textContent = 
        JSON.stringify(converted, null, 2);
    } catch (err) {
      document.getElementById('output').textContent = 
        'Error: ' + err.message;
    }
  };
  reader.readAsArrayBuffer(file);
});   
