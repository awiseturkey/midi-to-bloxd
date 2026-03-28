






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



function playMusicFromJSONforPlayer(data,playerId) {
  const notes = JSON.parse(data); // parse your JSON data


  for(let i = 0; i < notes.length; i += 2) {
    const p = notes[i];
    const t = notes[i + 1];

    // Schedule the note to play at time t
    timeoutManager.setTimeout(() => {
      // Use p directly as pitch
	    
	    api.playSound(playerId, "harp_pling", 1, p);
	    
    }, Math.round(t * 20));
  }
}

function playMusicFromJSONforEveryone(data) {
  const notes = JSON.parse(data); // parse your JSON data


  for(let i = 0; i < notes.length; i += 2) {
    const p = notes[i];
    const t = notes[i + 1];

    // Schedule the note to play at time t
    timeoutManager.setTimeout(() => {
      // Use p directly as pitch
	    api.broadcastSound("harp_pling", 1, p);
    }, Math.round(t * 20));
  }
}

tick = () => {
	timeoutManager.tick();
};