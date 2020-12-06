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

	status() {
		return {
			light: this.mbr.manualControls.light.get(),
			heater: this.mbr.manualControls.heater.get(),
			pump: this.mbr.manualControls.pump.get(),
			fan: this.mbr.manualControls.fan.get(),
			ok: 1
		}
	}
}

module.exports=CommandManager;