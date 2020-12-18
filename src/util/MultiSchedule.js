const EventEmitter=require("events");
const Schedule=require("./Schedule");

class MultiSchedule extends EventEmitter {
	constructor() {
		super();
		this.schedules=[];
	}

	addSchedule(def) {
		console.log("adding..");

		let schedule=new Schedule(def);

		schedule.on("trigger",this.onInterval);

		this.schedules.push(schedule);
	}

	clearSchedules() {
		for (let schedule of this.schedules) {
			schedule.stop();
			schedule.off("trigger",this.onInterval);
		}

		this.schedules=[];
	}

	onInterval=()=>{
		this.emit("trigger");
	}
}

module.exports=MultiSchedule;
