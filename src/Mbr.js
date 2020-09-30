const Blinker=require("./util/Blinker.js");
const MqttManager=require("./controller/MqttManager.js");
const SensorManager=require("./controller/SensorManager.js");
const CommandManager=require("./controller/CommandManager.js");

class Mbr {
	constructor(settings) {
		this.settings=settings;

		this.commandManager=new CommandManager(this);

		this.mqttManager=new MqttManager(this.settings, this.commandManager);
		this.mqttManager.on("statusChange",this.updateStatus);

		this.sensorManager=new SensorManager(this.settings);
		this.sensorManager.on("statusChange",this.updateStatus);

		this.connectionBlinker=new Blinker(17);
	}

	updateStatus=()=>{
		console.log("update status"
			+", mqtt: "+this.mqttManager.isConnected()
			+", sensors: "+this.sensorManager.getStatus());

		let status=(this.mqttManager.isConnected() && this.sensorManager.getStatus());

		if (status)
			this.connectionBlinker.setBlinkPattern("x                    ");

		else
			this.connectionBlinker.setBlinkPattern("x ");
	}

	run() {
		console.log("**** Starting the MBR. ****");

		this.mqttManager.run();
		this.sensorManager.run();

		this.updateStatus();
	}
}

module.exports=Mbr;