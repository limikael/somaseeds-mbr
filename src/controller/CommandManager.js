const Gpio = require('onoff').Gpio;

class CommandManager {
	constructor(mbr) {
		this.mbr=mbr;
		this.actions=["status","relay"];

		this.relays=[
			new Gpio(5,'out'),
			new Gpio(6,'out'),
			new Gpio(13,'out'),
			new Gpio(19,'out')
		];

		for (let i=0; i<4; i++)
			this.relays[i].writeSync(1);
	}

	status(params) {
		return {
			"ok": 1,
			"status": "ok"
		};
	}

	relay(params) {
		if (!this.relays[params.relay])
			throw new Error("No such relay");

		let v=1;
		if (params.val && params.val!="0")
			v=0;

		this.relays[params.relay].writeSync(v);

		return {
			ok: 1
		};
	}

	async step(params) {
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
	}
}

module.exports=CommandManager;