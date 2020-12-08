const ReactiveValue=require("./ReactiveValue");
const later=require("@breejs/later");
const Ms=require("ms");

class ReactiveScheduleTimer extends ReactiveValue {
	constructor() {
		super();
		later.date.localTime();

		this.duration=new ReactiveValue();
		this.schedule=new ReactiveValue();
		this.error=new ReactiveValue();

		this.duration.on("change",this.reinitiate);
		this.schedule.on("change",this.reinitiate);

		this.reinitiate();
	}

	reinitiate=()=>{
		if (this.enableTimeout) {
			this.enableTimeout.clear();
			this.enableTimeout=null;
		}

		if (this.disableTimeout) {
			clearTimeout(this.disableTimeout);
			this.disableTimeout=null;
		}

		this.laterSchedule=later.parse.text(String(this.schedule.get()));

		try {
			this.msDuration=Ms(String(this.duration.get()));
		}

		catch (err) {
			this.msDuration=undefined;
		}
		//console.log("shedule: "+this.schedule.get()+" duration: "+this.duration.get());

		if (this.laterSchedule.error>=0 || this.msDuration===undefined) {
			this.error.set("Parse error: "+this.laterSchedule.error);
			this.set(false);
			return;
		}

		else {
			this.error.set(null);
			this.enableTimeout=later.setTimeout(this.onEnableTimeout,this.laterSchedule);

			let now=Date.now();
			let prev=later.schedule(this.laterSchedule).prev(1);
			let diff=now-prev;
			if (diff<this.msDuration) {
				let offIn=prev-now+this.msDuration;
				this.set(true);
				this.disableTimeout=setTimeout(this.onDisableTimeout,offIn);
			}

			else {
				this.set(false);
			}
		}
	}

	onEnableTimeout=()=>{
		if (this.disableTimeout) {
			clearTimeout(this.disableTimeout);
			this.disableTimeout=null;
		}

		this.enableTimeout=later.setTimeout(this.onEnableTimeout,this.laterSchedule);
		this.disableTimeout=setTimeout(this.onDisableTimeout,this.msDuration);
		this.set(true);
	}

	onDisableTimeout=()=>{
		this.disableTimeout=null;
		this.set(false);
	}
}

module.exports=ReactiveScheduleTimer;
