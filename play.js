






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


  for(let i = 0; i < notes.length; i += 3) {
    const p = notes[i];
    const t = notes[i + 1];
    const v = notes[i + 2];

    // Schedule the note to play at time t
    timeoutManager.setTimeout(() => {
      // Use p directly as pitch
	    for(const id of api.getPlayerIds()) {
	      api.playSound(id, "harp_pling", v, p);
	    }
    }, Math.round(t * 30));
  }
}

tick = () => {
	timeoutManager.tick();
};