const EventEmitter=require("events");
const later=require("@breejs/later");

class Schedule extends EventEmitter {
	constructor(intervalOptions) {	
		super();

		later.date.localTime();
		this.intervalOptions=intervalOptions;

		if (!["day","hour","minute"].includes(this.intervalOptions.interval))
			throw new Error("Unknown interval type");

		later.setInterval(this.onInterval,this.getSched());
	}

	kindNumber(n) {
		n=Number(n);
		if (isNaN(n))
			n=0;

		return n;
	}

	getSched() {
		switch (this.intervalOptions.interval) {
			case "day":
				return {
					schedules: [{
						h: [this.kindNumber(this.intervalOptions.hour)],
						m: [this.kindNumber(this.intervalOptions.minute)],
						s: [this.kindNumber(this.intervalOptions.second)]
					}]
				};
				break;

			case "hour":
				return {
					schedules: [{
						m: [this.kindNumber(this.intervalOptions.minute)],
						s: [this.kindNumber(this.intervalOptions.second)]
					}]
				};
				break;

			case "minute":
				return {
					schedules: [{
						s: [this.kindNumber(this.intervalOptions.second)]
					}]
				};
				break;
		}
	}

	onInterval=()=>{
		this.emit("trigger");
	}

	stop() {
		if (this.interval) {
			later.clearInterval(this.interval);
			this.interval=null;
		}
	}
}

module.exports=Schedule;