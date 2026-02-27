






class TimeoutManager {
	queue = {};
	currTick = 0;
	setTimeout(fn, delayTicks) {
		const execTick = this.currTick + delayTicks;
		this.queue[execTick] ??= [];
		this.queue[execTick].push(fn);
	}
	tick() {
		this.currTick++;

		const fns = this.queue[this.currTick];
		delete this.queue[this.currTick];

		if(!fns) return;
		for(const fn of fns) fn.call();
	}
}
let timeoutManager = new TimeoutManager();



function playMusicFromJSON(data) {
  const notes = JSON.parse(data); // parse your JSON data


  notes.forEach(note => {
    console.log(note);
    const p = note.p;
    const t = note.t;

    // Schedule the note to play at time t
    timeoutManager.setTimeout(() => {
      // Use p directly as pitch
      console.log("executed");
	  for(const id of api.getPlayerIds()) {
	      api.playSound(id, "harp_pling", 1, p);
	    }
    }, Math.round(t * 30));
  });
}

tick = () => {
	timeoutManager.tick();
};













// Initialize variables
let notesToPlay = [];
let startTime = 0;

// Function to start playing music from JSON data
function playMusicFromJSON(data) {
  const notes = JSON.parse(data);
  startTime = api.now; // Capture the current timestamp in milliseconds

  // Prepare notes with absolute scheduled time
  notesToPlay = notes.map(note => ({
    p: note.p,
    scheduledTime: startTime + note.t * 1000, // Convert seconds to milliseconds
    played: false
  }));
}

// Your tick function to be called regularly (e.g., every frame)
function tick() {
  const currentTime = api.now;

  // Check each note to see if it's time to play
  for (const note of notesToPlay) {
    if (!note.played && currentTime >= note.scheduledTime) {
      // Play the note
      for (const id of api.getPlayerIds()) {
        api.playSound(id, "harp_pling", 1, note.p);
      }
      note.played = true; // Mark as played
      console.log(`Played note with pitch ${note.p} at ${currentTime} ms (scheduled for ${note.scheduledTime} ms)`);
    }
  }
}

// Example usage:
// Call playMusicFromJSON with your data string when ready
// playMusicFromJSON(yourDataString);

// Make sure your environment calls tick() frequently (e.g., every frame or 60 fps)
/* Example:
setInterval(tick, 16); // roughly 60 times per second
or integrate tick() into your main render/update loop
*/