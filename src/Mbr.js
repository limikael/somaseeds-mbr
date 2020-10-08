const Blinker=require("./util/Blinker.js");
const SensorManager=require("./controller/SensorManager.js");
const CommandManager=require("./controller/CommandManager.js");
const restbroker=require("restbroker");
const ApiProxy=require("./util/ApiProxy");

class Mbr {
	constructor(settings) {
		this.settings=settings;

		this.commandManager=new CommandManager(this);
		this.apiProxy=new ApiProxy(this.commandManager);

		this.restClient=new restbroker.Client({
			url: this.settings.brokerUrl,
			handler: this.apiProxy.handleCall
		});

		this.restClient.on("stateChange",this.updateStatus);

		this.sensorManager=new SensorManager(this.settings);
		this.sensorManager.on("statusChange",this.updateStatus);

		this.connectionBlinker=new Blinker(17);
	}

	updateStatus=()=>{
		console.log("update status"
			+", rest: "+this.restClient.isConnected()
			+", sensors: "+this.sensorManager.getStatus());

		let status=(this.restClient.isConnected() && this.sensorManager.getStatus());

		if (status)
			this.connectionBlinker.setBlinkPattern("x                    ");

		else
			this.connectionBlinker.setBlinkPattern("x ");
	}

	run() {
		console.log("**** Starting the MBR. ****");

		this.sensorManager.run();

		this.updateStatus();
	}
}

module.exports=Mbr;