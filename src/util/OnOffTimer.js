const Events=require("events");
const later=require("@breejs/later");
const Ms=require("ms");

class OnOffTimer extends Events {
	constructor() {
		super();
		later.date.localTime();
		this.state=false;
	}

	setDuration(durationText) {
		if (!durationText) {
			this.duration=null;
		}

		else {
			let duration=Ms(durationText);
			if (duration===undefined)
				throw new Error("Unable to parse duration.");

			this.duration=duration;
		}

		this.reinitiate();
	}

	/**
	 * Expression: sec min hour day-of-the-month month day-of-the-week
	 */
	setScheduleByCron(cronExpression) {
		if (!cronExpression) {
			this.sched=null;
		}

		else {
			if (cronExpression.split(" ").length!=6)
				throw new Error("Expected 6 components!");

			let sched=later.parse.cron(cronExpression, true);
			if (sched.error>=0)
				throw new Error("Unable to parse expression, at pos "+sched.error);

			this.sched=sched;
		}

		this.reinitiate();
	}

	setScheduleByText(scheduleText) {
		if (!scheduleText) {
			this.sched=null;
		}

		else {
			let sched=later.parse.text(scheduleText);
			if (sched.error>=0)
				throw new Error("Unable to parse expression, at pos "+sched.error);

			this.sched=sched;
		}

		this.reinitiate();
	}

	reinitiate() {
		if (this.enableTimeout) {
			this.enableTimeout.clear();
			this.enableTimeout=null;
		}

		if (this.disableTimeout) {
			clearTimeout(this.disableTimeout);
			this.disableTimeout=null;
		}

		if (!this.duration || !this.sched) {
			this.setState(false);
			return;
		}

		this.enableTimeout=later.setTimeout(this.onEnableTimeout,this.sched);

		let now=Date.now();
		let prev=later.schedule(this.sched).prev(1);
		let diff=now-prev;
		if (diff<this.duration) {
			let offIn=prev-now+this.duration;
			this.setState(true);
			this.disableTimeout=setTimeout(this.onDisableTimeout,offIn);
		}

		else {
			this.setState(false);
		}
	}

	onEnableTimeout=()=>{
		if (this.disableTimeout) {
			clearTimeout(this.disableTimeout);
			this.disableTimeout=null;
		}

		this.enableTimeout=later.setTimeout(this.onEnableTimeout,this.sched);
		this.disableTimeout=setTimeout(this.onDisableTimeout,this.duration);
		this.setState(true);
	}

	onDisableTimeout=()=>{
		this.disableTimeout=null;
		this.setState(false);
	}

	setState(state) {
		if (state!=this.state) {
			this.state=state;
			this.emit("stateChange");
		}
	}

	isOn() {
		return this.state;
	}
}

module.exports=OnOffTimer;
