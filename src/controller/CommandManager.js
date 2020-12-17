class CommandManager {
	constructor(mbr) {
		this.mbr=mbr;
	}

	update(params) {
		if (params.hasOwnProperty("mode"))
			this.mbr.settings.mode.set(params.mode);

		return {
			ok: 1
		}
	}

	status() {
		return {
			fields: [
				{
					key: "mode",
					name: "Mode",
					value: this.mbr.settings.mode.get()
				},

				{
					key: "targetTemp",
					name: "Temperture",
					value: this.mbr.settings.targetTemp.get()
				},

				{
					key: "tempTolerance",
					name: "Temperture Tolerance",
					value: this.mbr.settings.tempTolerance.get()
				}
			],
			ok: 1
		};
	}
}

module.exports=CommandManager;