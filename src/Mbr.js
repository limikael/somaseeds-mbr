const ReactiveBlinker=require("./reactive/ReactiveBlinker.js");
const CommandManager=require("./controller/CommandManager.js");
const ApiProxy=require("./util/ApiProxy.js");
const restbroker=require("restbroker");
const ReactiveValue=require("./reactive/ReactiveValue.js");
const ReactiveExpression=require("./reactive/ReactiveExpression.js");
const fs=require("fs");
const ReactiveConsole=require("./reactive/ReactiveConsole.js");
const ReactiveDhtSensor=require("./reactive/ReactiveDhtSensor.js");
const ReactiveMcp23017=require("./reactive/ReactiveMcp23017.js");
const ReactiveDcMotor=require("./reactive/ReactiveDcMotor.js");
const ReactiveUtil=require("./reactive/ReactiveUtil.js");
const i2cbus=require('i2c-bus');

class Mbr {
	constructor(settingsFileName) {
		this.settingsFileName=settingsFileName;
		this.settings=JSON.parse(fs.readFileSync(this.settingsFileName));

		this.commandManager=new CommandManager(this);
		this.apiProxy=new ApiProxy(this.commandManager);
		this.restClient=new restbroker.Client(this.apiProxy.handleCall);
		this.restClient.setId("somaseeds1");
		this.restClient.setKey(this.settings.apiKey)
		this.restClient.connect(this.settings.brokerUrl);

		this.restStatus=new ReactiveValue('boolean');
		this.restStatus.set(this.restClient.isConnected());
		this.restClient.on("stateChange",()=>{
			this.restStatus.set(this.restClient.isConnected());
		});

		this.blinkPattern=new ReactiveExpression((restStatus)=>{
			if (restStatus)
				return "x                   ";

			return "x ";
		});
		this.blinkPattern.param(0).connect(this.restStatus);

		this.blinker=new ReactiveBlinker(17);
		this.blinker.pattern.connect(this.blinkPattern);

		this.dhtSensor=new ReactiveDhtSensor(22,4,1000);

		this.heater=new ReactiveValue('boolean');
		this.light=new ReactiveValue('boolean');

		this.i2c=i2cbus.openSync(1);
		this.relayMcp=new ReactiveMcp23017(this.i2c,0x20);
		this.relayMcp.pin(0).connect(ReactiveUtil.invert(this.heater));
		this.relayMcp.pin(1).connect(ReactiveUtil.invert(this.light));
		this.relayMcp.pin(2).set(1);
		this.relayMcp.pin(3).set(1);

		this.motorMcp=new ReactiveMcp23017(this.i2c,0x21);
		this.pumpMotor=new ReactiveDcMotor(this.motorMcp.pin(0),this.motorMcp.pin(1));
		this.fanMotor=new ReactiveDcMotor(this.motorMcp.pin(2),this.motorMcp.pin(3));

		this.manualControls={
			light: new ReactiveValue('boolean'),
			heater: new ReactiveValue('boolean'),
			pump: new ReactiveValue('number-not-nan'),
			fan: new ReactiveValue('number-not-nan')
		}

		this.light.connect(this.manualControls.light);
		this.heater.connect(this.manualControls.heater);
		this.pumpMotor.direction.connect(this.manualControls.pump);
		this.fanMotor.direction.connect(this.manualControls.fan);
	}

	run() {
		console.log("**** Starting the MBR. ****");

		this.console=new ReactiveConsole("OpenSeeds MBR");
		this.console.addWatch("REST Connection: ",this.restStatus);
		this.console.addWatch("Temperature:",this.dhtSensor.temperature);
		this.console.addWatch("Humidity:",this.dhtSensor.humidity);
		this.console.addWatch("Sensor Error:",this.dhtSensor.error);
		this.console.addWatch("Manual Light:",this.manualControls.light);
		this.console.addWatch("Manual Heater:",this.manualControls.heater);
		this.console.addWatch("Manual Pump:",this.manualControls.pump);
		this.console.addWatch("Manual Fan:",this.manualControls.fan);
	}
}

module.exports=Mbr;