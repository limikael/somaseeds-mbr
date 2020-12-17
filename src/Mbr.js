const ReactiveDevice=require("./reactive/ReactiveDevice");

class Mbr {
	constructor(settingsFileName) {
		this.device=new ReactiveDevice(settingsFileName);

		this.device.addField("mode",{
			type: "select",
			name: "Mode",
			options: {
				manual: "Manual",
				auto: "Auto",
				autodebug: "Auto debug",
			},
			tab: "Settings"
		});

		this.device.addField("manualLight",{
			type: "select",
			name: "Light",
			options: {
				false: "Off",
				true: "On"
			},
			conditionKey: "mode",
			conditionValue: "manual",
			tab: "Settings"
		});

		this.device.addField("manualHeater",{
			type: "select",
			name: "Heater",
			options: {
				false: "Off",
				true: "On"
			},
			conditionKey: "mode",
			conditionValue: "manual",
			tab: "Settings"
		});

		this.device.addField("manualFan",{
			type: "select",
			name: "Fan",
			options: {
				"0": "0",
				"1": "1"
			},
			conditionKey: "mode",
			conditionValue: "manual",
			tab: "Settings"
		});

		this.device.addField("manualPump",{
			type: "select",
			name: "Pump",
			options: {
				"-1": "-1",
				"0": "0",
				"1": "1"
			},
			conditionKey: "mode",
			conditionValue: "manual",
			tab: "Settings"
		});

		this.device.addField("targetTemp",{
			type: "text",
			name: "Temperature",
			conditionKey: "mode",
			conditionValue: "auto",
			tab: "Settings"
		});

		this.device.addField("floodDuration",{
			type: "text",
			name: "Flood Duration",
			tab: "Flood & Drain"
		});

		this.device.addField("waitDuration",{
			type: "text",
			name: "Wait Duration",
			tab: "Flood & Drain"
		});

		this.device.addField("drainDuration",{
			type: "text",
			name: "Drain Duration",
			tab: "Flood & Drain"
		});

		this.device.addField("lightDuration",{
			type: "text",
			name: "Light Duration",
			tab: "Light"
		});

		this.device.addField("lightSchedule",{
			type: "schedule",
			name: "Light Schedule",
			tab: "Light"
		});

		this.device.addField("ph1",{
			type: "text",
			name: "pH1",
			tab: "pH Calibration"
		});

		this.device.addField("ph2",{
			type: "text",
			name: "pH2",
			tab: "pH Calibration"
		});

		this.device.addField("ph3",{
			type: "text",
			name: "pH3",
			tab: "pH Calibration"
		});

		this.device.addField("ph4",{
			type: "text",
			name: "pH4",
			tab: "pH Calibration"
		});
	}

	run() {}
}

module.exports=Mbr;