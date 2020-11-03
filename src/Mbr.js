const Blinker=require("./util/Blinker.js");
const SensorManager=require("./controller/SensorManager.js");
const CommandManager=require("./controller/CommandManager.js");
const restbroker=require("restbroker");
const ApiProxy=require("./util/ApiProxy");
const Stepper=require("../src/util/Stepper");
const i2cbus=require('i2c-bus');
const Mcp23017=require("../src/util/Mcp23017.js");

class Mbr {
	constructor(settings) {
		this.settings=settings;

		/*this.sensorManager=new SensorManager(this.settings);
		this.sensorManager.on("statusChange",this.updateStatus);*/

		this.connectionBlinker=new Blinker(17);

		this.i2c=i2cbus.openSync(1);
		let relayMcp=new Mcp23017(this.i2c,0x20);
		this.relays=[
			relayMcp.createGPIO(0,'output'),
			relayMcp.createGPIO(1,'output'),
			relayMcp.createGPIO(2,'output'),
			relayMcp.createGPIO(3,'output')
		];

		this.stepper=new Stepper(16,20,21,26);
		this.stepper.setStepsPerSec(200);

		this.commandManager=new CommandManager(this);
		this.apiProxy=new ApiProxy(this.commandManager);

		this.restClient=new restbroker.Client({
			url: this.settings.brokerUrl,
			handler: this.apiProxy.handleCall
		});

		this.restClient.on("stateChange",this.updateStatus);
	}

	updateStatus=()=>{
		console.log("update status"
			+", rest: "+this.restClient.isConnected()
			/*+", sensors: "+this.sensorManager.getStatus()*/);

		let status=(this.restClient.isConnected() /*&& this.sensorManager.getStatus()*/);

		if (status)
			this.connectionBlinker.setBlinkPattern("x                    ");

		else
			this.connectionBlinker.setBlinkPattern("x ");
	}

	run() {
		console.log("**** Starting the MBR. ****");

		//this.sensorManager.run();

		this.updateStatus();
	}
}

module.exports=Mbr;