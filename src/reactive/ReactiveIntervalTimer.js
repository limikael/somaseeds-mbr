const ReactiveValue=require("./ReactiveValue.js");
const MultiSchedule=require("../util/MultiSchedule.js");

class ReactiveIntervalTimer extends ReactiveValue {
	constructor() {
		super();

		this.multiSchedule=new MultiSchedule();
		this.multiSchedule.on("trigger",this.onTrigger);

		this.on("change",this.updateTimer);
	}

	updateTimer=()=>{
		this.multiSchedule.clearSchedules();

		for (let def of this.get()) {
			console.log(def);

			if (def.interval)
				this.multiSchedule.addSchedule(def);
		}
	}

	onTrigger=()=>{
		this.emit("trigger");
	}
}

module.exports=ReactiveIntervalTimer;