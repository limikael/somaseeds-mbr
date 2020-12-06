const Blinker=require("./util/Blinker.js");
const SensorManager=require("./controller/SensorManager.js");
const CommandManager=require("./controller/CommandManager.js");
const restbroker=require("restbroker");
const ApiProxy=require("./util/ApiProxy");
const DcMotor=require("../src/util/DcMotor.js");
const i2cbus=require('i2c-bus');
const Mcp23017=require("../src/util/Mcp23017.js");
const OnOffTimer=require("../src/util/OnOffTimer.js");
const SchmittTrigger=require("../src/util/SchmittTrigger.js");
const fs=require("fs");
const PromiseUtil=require("../src/util/PromiseUtil.js");

class Mbr {
	constructor(settingsFileName) {
		console.log("Loading settings from: "+settingsFileName);
		this.settingsFileName=settingsFileName;

		this.settings=JSON.parse(fs.readFileSync(this.settingsFileName));

		this.sensorManager=new SensorManager(this.settings);
		this.sensorManager.on("statusChange",this.updateStatus);
		this.sensorManager.on("reading",this.updateHeating);

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

		this.fan=motorMcp.createGPIO(3,'output');

		this.commandManager=new CommandManager(this);
		this.apiProxy=new ApiProxy(this.commandManager);

		this.restClient=new restbroker.Client(this.apiProxy.handleCall);
		this.restClient.setId("somaseeds1");
		this.restClient.setKey(this.settings.apiKey)
		this.restClient.connect(this.settings.brokerUrl);

		this.restClient.on("stateChange",this.updateStatus);

		this.lightTimer=new OnOffTimer();
		this.lightTimer.on("stateChange",this.updateOutputs);
		this.forwardTimer=new OnOffTimer();
		this.forwardTimer.on("stateChange",this.updateOutputs);
		this.backwardTimer=new OnOffTimer();
		this.backwardTimer.on("stateChange",this.updateOutputs);

		this.tempTrigger=new SchmittTrigger();

		this.updateSettings();
		this.updateOutputs();
	}

	updateOutputs=()=>{
		this.relays[1].writeSync(!this.lightTimer.isOn());

		if (this.forwardTimer.isOn())
			this.motor.setSpeed(1);

		else if (this.backwardTimer.isOn())
			this.motor.setSpeed(-1);

		else
			this.motor.setSpeed(0);
	}

	updateSettings() {
		try {
			this.tempTrigger.setLowValue(this.settings.lowTemp);
			this.tempTrigger.setHighValue(this.settings.highTemp);

			this.lightTimer.setDuration(this.settings.lightDuration);
			this.lightTimer.setScheduleByText(this.settings.lightSchedule);

			this.forwardTimer.setDuration(this.settings.forwardDuration);
			this.forwardTimer.setScheduleByText(this.settings.forwardSchedule);

			this.backwardTimer.setDuration(this.settings.backwardDuration);
			this.backwardTimer.setScheduleByText(this.settings.backwardSchedule);
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

	updateHeating=async ()=>{
		let temp=this.sensorManager.reading.temperature;
		this.tempTrigger.setValue(temp);

		this.relays[0].writeSync(this.tempTrigger.getState());

		await PromiseUtil.delay(100);

		let fanVal=!this.tempTrigger.getState();
		this.fan.writeSync(fanVal);

		console.log("temp: "+temp+" temp-trigger: "+this.tempTrigger.getState()+" fan: "+fanVal);
	}

	run() {
		console.log("**** Starting the MBR. ****");

		this.sensorManager.run();

		this.updateStatus();
	}
}

module.exports=Mbr;