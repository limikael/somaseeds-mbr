class CommandManager {
	constructor(mbr) {
		this.mbr=mbr;
	}

	setting(params) {
		let reactiveNames=[
			"lightSchedule","lightDuration",
			"forwardSchedule","forwardDuration",
			"backwardSchedule","backwardDuration",
			"phFirstRaw","phFirstTranslated",
			"phSecondRaw","phSecondTranslated",
			"lowTemp","highTemp","mode"
		];

		for (let reactiveName of reactiveNames)
			if (params.hasOwnProperty(reactiveName))
				this.mbr.settings[reactiveName].set(params[reactiveName]);

		let manualNames=[
			"light","heater","pump","fan","debugTemp"
		];

		for (let manualName of manualNames)
			if (params.hasOwnProperty(manualName))
				this.mbr.manualControls[manualName].set(params[manualName]);

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
			"lowTemp","highTemp","mode"
		];

		let status={
			light: this.mbr.manualControls.light.get(),
			heater: this.mbr.manualControls.heater.get(),
			pump: this.mbr.manualControls.pump.get(),
			fan: this.mbr.manualControls.fan.get(),
			debugTemp: this.mbr.manualControls.debugTemp.get(),

			temperature: this.mbr.dhtSensor.temperature.get(),
			humidity: this.mbr.dhtSensor.humidity.get(),

			ph: this.mbr.phTranslator.get(),
			phRaw: this.mbr.adConverter.value.get(),

			ok: 1
		};

		for (let reactiveSetting of reactiveSettings)
			status[reactiveSetting]=this.mbr.settings[reactiveSetting].get()

		return status;
	}
}

module.exports=CommandManager;