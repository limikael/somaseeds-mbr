const Gpio = require('onoff').Gpio;
const PromiseUtil = require("../util/PromiseUtil");
const later=require("@breejs/later");
const Ms=require("ms");

class CommandManager {
	constructor(mbr) {
		this.mbr=mbr;
		this.actions=["status","relay"];

		for (let i=0; i<4; i++)
			this.mbr.relays[i].writeSync(1);
	}

	status(params) {
		return {
			"ok": 1,
			"status": "ok"
		};
	}

	relay(params) {
		if (!this.mbr.relays[params.relay])
			throw new Error("No such relay");

		let v=1;
		if (params.val && params.val!="0")
			v=0;

		this.mbr.relays[params.relay].writeSync(v);

		return {
			ok: 1
		};
	}

	/*async step(params) {
		let steps=parseInt(params.steps);
		if (!steps)
			steps=200;

		this.mbr.stepper.setDirection(true);
		if (steps<0) {
			this.mbr.stepper.setDirection(false);
			steps=-steps;
		}

		await this.mbr.stepper.step(steps);
		this.mbr.stepper.release();

		return {
			ok: 1
		};
	}*/

	async start(params) {
		if (this.mbr.motor.speed!=0) {
			this.mbr.motor.stop();
			await PromiseUtil.delay(100);
		}

		if (params.reverse)
			this.mbr.motor.setSpeed(-1);

		else
			this.mbr.motor.setSpeed(1);

		return {
			ok: 1
		};
	}

	stop(params) {
		this.mbr.motor.stop();
		return {
			ok: 1
		};
	}

	lightSchedule(params) {
		if (params.off) {
			console.log("turning light off");
			this.mbr.settings.lightSchedule="";
			this.mbr.settings.lightDuration="";
		}

		else {
			let sched=later.parse.text(params.schedule);
			if (sched.error>=0)
				throw new Error("Unable to parse schedule expression, at pos "+sched.error);

			let duration=Ms(params.duration);
			if (duration===undefined || !duration)
				throw new Error("Unable to parse duration.");

			this.mbr.settings.lightSchedule=params.schedule;
			this.mbr.settings.lightDuration=params.duration;
		}

		this.mbr.updateSettings();
		this.mbr.saveSettings(["lightSchedule","lightDuration"]);

		return {
			ok: 1
		};
	}
}

module.exports=CommandManager;