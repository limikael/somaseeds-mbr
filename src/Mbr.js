const Blinker=require("./util/Blinker.js");
const SensorManager=require("./controller/SensorManager.js");
const CommandManager=require("./controller/CommandManager.js");
const restbroker=require("restbroker");
const ApiProxy=require("./util/ApiProxy");
const DcMotor=require("../src/util/DcMotor.js");
const i2cbus=require('i2c-bus');
const Mcp23017=require("../src/util/Mcp23017.js");
const OnOffTimer=require("../src/util/OnOffTimer.js");
const fs=require("fs");

class Mbr {
	constructor(settingsFileName) {
		console.log("Loading settings from: "+settingsFileName);
		this.settingsFileName=settingsFileName;

		this.settings=JSON.parse(fs.readFileSync(this.settingsFileName));

		this.sensorManager=new SensorManager(this.settings);
		this.sensorManager.on("statusChange",this.updateStatus);

		this.connectionBlinker=new Blinker(17);

		this.i2c=i2cbus.openSync(1);
		let relayMcp=new Mcp23017(this.i2c,0x20);
		this.relays=[
			relayMcp.createGPIO(0,'output'),
			relayMcp.createGPIO(1,'output'),
			relayMcp.createGPIO(2,'output'),
			relayMcp.createGPIO(3,'output')
		];

		let motorMcp=new Mcp23017(this.i2c,0x21);
		this.motor=new DcMotor(
			motorMcp.createGPIO(0,'output'),
			motorMcp.createGPIO(1,'output')
		);

		this.commandManager=new CommandManager(this);
		this.apiProxy=new ApiProxy(this.commandManager);

		this.restClient=new restbroker.Client(this.apiProxy.handleCall);
		this.restClient.setId("somaseeds1");
		this.restClient.setKey(this.settings.apiKey)
		this.restClient.connect(this.settings.brokerUrl);

		this.restClient.on("stateChange",this.updateStatus);

		this.lightTimer=new OnOffTimer();
		this.lightTimer.on("stateChange",this.updateOutputs);

		this.updateSettings();
		this.updateOutputs();
	}

	updateOutputs=()=>{
		this.relays[1].writeSync(!this.lightTimer.isOn());
	}

	updateSettings() {
		try {
			this.lightTimer.setDuration(this.settings.lightDuration);
			this.lightTimer.setScheduleByText(this.settings.lightSchedule);
		}

		catch (e) {
			console.log(e);
		}
	}

	saveSettings() {
		fs.writeFileSync(this.settingsFileName,JSON.stringify(this.settings,null,2));
		console.log("settings saved");
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