const ReactiveBlinker=require("./reactive/ReactiveBlinker");
const CommandManager=require("./controller/CommandManager");
const ApiProxy=require("./util/ApiProxy");
const restbroker=require("restbroker");
const ReactiveValue=require("./reactive/ReactiveValue");
const ReactiveExpression=require("./reactive/ReactiveExpression");
const ReactiveConsole=require("./reactive/ReactiveConsole");
const ReactiveConsoleLogger=require("./reactive/ReactiveConsoleLogger");
const ReactiveDhtSensor=require("./reactive/ReactiveDhtSensor");
const ReactiveMcp23017=require("./reactive/ReactiveMcp23017");
const ReactiveDcMotor=require("./reactive/ReactiveDcMotor");
const ReactiveOp=require("./reactive/ReactiveOp");
const ReactiveLogger=require("./reactive/ReactiveLogger");
const ReactiveScheduleTimer=require("./reactive/ReactiveScheduleTimer");
const ReactiveSchmittTrigger=require("./reactive/ReactiveSchmittTrigger");
const ReactiveConfig=require("./reactive/ReactiveConfig");
const ReactiveAdConverter=require("./reactive/ReactiveAdConverter");
const ReactiveLinearTranslator=require("./reactive/ReactiveLinearTranslator");
const i2cbus=require('i2c-bus');

class Mbr {
	constructor(settingsFileName) {
		let reactiveSettings=[
			"targetTemp","tempTolerance","mode"
		];

		this.settings=new ReactiveConfig(settingsFileName,reactiveSettings);

		this.commandManager=new CommandManager(this);
		this.apiProxy=new ApiProxy(this.commandManager);
		this.restClient=new restbroker.Client(this.apiProxy.handleCall);
		this.restClient.setId(this.settings.id);
		this.restClient.setKey(this.settings.apiKey)
		this.restClient.connect(this.settings.brokerUrl);

		this.restStatus=new ReactiveValue('boolean');
		this.restStatus.set(this.restClient.isConnected());
		this.restClient.on("stateChange",()=>{
			this.restStatus.set(this.restClient.isConnected());
		});

		this.console=new ReactiveConsole("OpenSeeds MBR");
		this.console.addWatch("Rest Status: ",this.restStatus);
		this.console.addWatch("Mode: ",this.settings.mode);
		this.console.addWatch("Temperature: ",this.settings.targetTemp);
		this.console.addWatch("Temp Tolerance: ",this.settings.tempTolerance);
	}

	run() {
	}
}

module.exports=Mbr;