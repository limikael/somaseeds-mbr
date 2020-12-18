const ReactiveDevice=require("./reactive/ReactiveDevice");
const MbrLogic=require("./modules/MbrLogic");
const MbrMockHardware=require("./modules/MbrMockHardware");
const ReactiveOp=require("./reactive/ReactiveOp");

class Mbr {
	constructor(settingsFileName) {
		this.device=new ReactiveDevice(settingsFileName);
		this.device.setDeviceDef(require("./Mbr.devicedef.json"));

		this.logic=new MbrLogic();
		this.device.lightSchedule.on("trigger",this.logic.startLight);
		this.logic.lightDuration.connect(this.device.lightDuration);
		this.logic.tempTarget.connect(this.device.tempTarget);
		this.logic.tempTolerance.connect(this.device.tempTolerance);
		this.logic.floodDuration.connect(this.device.floodDuration);
		this.logic.waitDuration.connect(this.device.waitDuration);
		this.logic.drainDuration.connect(this.device.drainDuration);
		this.device.pumpSchedule.on("trigger",this.logic.startPump);

		this.hw=new MbrMockHardware();
		//this.hw=new MbrMockHardware();

		let debugMode=ReactiveOp.expr(
			mode=>(mode=="debug"),
			this.device.mode
		);

		this.logic.temperature.connect(ReactiveOp.if(
			debugMode,
			this.device.debugTemp,
			this.hw.temperature
		));

		let autoMode=ReactiveOp.expr(
			mode=>(mode=="auto" || mode=="debug"),
			this.device.mode
		);

		this.hw.light.connect(ReactiveOp.if(
			autoMode,
			this.logic.light,
			this.device.manualLight
		));

		this.hw.heater.connect(ReactiveOp.if(
			autoMode,
			this.logic.heater,
			this.device.manualHeater
		));

		this.hw.fanDirection.connect(ReactiveOp.if(
			autoMode,
			this.logic.fanDirection,
			this.device.manualFan
		));

		this.hw.pumpDirection.connect(ReactiveOp.if(
			autoMode,
			this.logic.pumpDirection,
			this.device.manualPump
		));

		this.device.addWatch("Hw Light: ",this.hw.light);
		this.device.addWatch("Hw Heater: ",this.hw.heater);
		this.device.addWatch("Hw Fan: ",this.hw.fanDirection);
		this.device.addWatch("Hw Pump: ",this.hw.pumpDirection);
	}

	run() {}
}

module.exports=Mbr;