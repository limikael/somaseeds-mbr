const ReactiveDevice=require("./reactive/ReactiveDevice");

class Mbr {
	constructor(settingsFileName) {
		this.device=new ReactiveDevice(settingsFileName);
		this.device.setDeviceDef(require("./Mbr.devicedef.json"));

		this.device.lightSchedule.on("trigger",()=>{
			console.log("lighttimer");
		});
	}

	run() {}
}

module.exports=Mbr;