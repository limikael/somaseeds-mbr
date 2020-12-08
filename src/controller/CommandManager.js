class CommandManager {
	constructor(mbr) {
		this.mbr=mbr;
	}

	manual(params) {
		let control=params._[0];

		if (!this.mbr.manualControls[control])
			throw new Error("No such manualcontrol");

		this.mbr.manualControls[control].set(params.value);

		return {
			ok: 1
		};
	}

	setting(params) {
		let reactiveNames=[
			"lightSchedule","lightDuration",
			"forwardSchedule","forwardDuration",
			"backwardSchedule","backwardDuration",
			"phFirstRaw","phFirstTranslated",
			"phSecondRaw","phSecondTranslated",
			"lowTemp","highTemp"
		];

		for (let reactiveName of reactiveNames)
			if (params.hasOwnProperty(reactiveName))
				this.mbr.settings[reactiveName].set(params[reactiveName]);

		return {
			ok: 1
		};
	}

	status() {
		let reactiveSettings=[
			"lightSchedule","lightDuration",
			"forwardSchedule","forwardDuration",
			"backwardSchedule","backwardDuration",
			"phFirstRaw","phFirstTranslated",
			"phSecondRaw","phSecondTranslated",
			"lowTemp","highTemp"
		];

		let status={
			light: this.mbr.manualControls.light.get(),
			heater: this.mbr.manualControls.heater.get(),
			pump: this.mbr.manualControls.pump.get(),
			fan: this.mbr.manualControls.fan.get(),
			debugTemp: this.mbr.manualControls.debugTemp.get(),
			ok: 1
		};

		for (let reactiveSetting of reactiveSettings)
			status[reactiveSetting]=this.mbr.settings[reactiveSetting].get()

		return status;
	}
}

module.exports=CommandManager;