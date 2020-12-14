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
			"lightSchedule","lightDuration",
			"forwardSchedule","forwardDuration",
			"backwardSchedule","backwardDuration",
			"phFirstRaw","phFirstTranslated",
			"phSecondRaw","phSecondTranslated",
			"lowTemp","highTemp","mode"
		];

		this.settings=new ReactiveConfig(settingsFileName,reactiveSettings);

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

		// Sensors and output
		this.adConverter=new ReactiveAdConverter(0);

		this.dhtSensor=new ReactiveDhtSensor(22,4,1000);

		this.heater=new ReactiveValue('boolean');
		this.light=new ReactiveValue('boolean');

		this.i2c=i2cbus.openSync(1);
		this.relayMcp=new ReactiveMcp23017(this.i2c,0x20);
		this.relayMcp.pin(0).connect(ReactiveOp.not(this.heater));
		this.relayMcp.pin(1).connect(ReactiveOp.not(this.light));
		this.relayMcp.pin(2).set(1);
		this.relayMcp.pin(3).set(1);

		this.motorMcp=new ReactiveMcp23017(this.i2c,0x21);
		this.pumpMotor=new ReactiveDcMotor(this.motorMcp.pin(0),this.motorMcp.pin(1));
		this.fanMotor=new ReactiveDcMotor(this.motorMcp.pin(2),this.motorMcp.pin(3));

		this.temperatureLogger=new ReactiveLogger(this.settings.url);
		this.temperatureLogger.setData("var","temperature");
		this.temperatureLogger.setData("value",this.dhtSensor.temperature);

		this.humitidyLogger=new ReactiveLogger(this.settings.url);
		this.humitidyLogger.setData("var","humidity");
		this.humitidyLogger.setData("value",this.dhtSensor.humidity);

		this.status=ReactiveOp.and(
			this.restStatus,
			ReactiveOp.not(this.dhtSensor.error),
			ReactiveOp.not(this.temperatureLogger.error),
			ReactiveOp.not(this.humitidyLogger.error)
		);

		this.blinkPattern=new ReactiveExpression((status)=>{
				if (status)
					return "x                   ";

				return "x ";
			}
		);

		this.blinkPattern.param(0).connect(this.status);

		this.blinker=new ReactiveBlinker(17);
		this.blinker.pattern.connect(this.blinkPattern);

		this.manualControls={
			light: new ReactiveValue('boolean'),
			heater: new ReactiveValue('boolean'),
			pump: new ReactiveValue('number-not-nan'),
			fan: new ReactiveValue('number-not-nan'),
			debugTemp: new ReactiveValue()
		};

		this.manualControls.debugTemp.set(29);

		// Timers and logic.
		this.lightTimer=new ReactiveScheduleTimer();
		this.lightTimer.schedule.connect(this.settings.lightSchedule);
		this.lightTimer.duration.connect(this.settings.lightDuration);

		this.forwardTimer=new ReactiveScheduleTimer();
		this.forwardTimer.schedule.connect(this.settings.forwardSchedule);
		this.forwardTimer.duration.connect(this.settings.forwardDuration);

		this.backwardTimer=new ReactiveScheduleTimer();
		this.backwardTimer.schedule.connect(this.settings.backwardSchedule);
		this.backwardTimer.duration.connect(this.settings.backwardDuration);

		this.tempStatus=new ReactiveSchmittTrigger();
		this.tempStatus.high.connect(this.settings.highTemp);
		this.tempStatus.low.connect(this.settings.lowTemp);
		this.tempStatus.input.connect(ReactiveOp.expr(
			(mode,sensorTemp,debugTemp)=>{
				if (mode=="autodebug")
					return debugTemp;

				else
					return sensorTemp;
			},
			this.settings.mode,
			this.dhtSensor.temperature,
			this.manualControls.debugTemp
		));

		this.phTranslator=new ReactiveLinearTranslator();
		this.phTranslator.input.connect(this.adConverter.value);
		this.phTranslator.measuredOne.connect(this.settings.phFirstRaw);
		this.phTranslator.measuredTwo.connect(this.settings.phSecondRaw);
		this.phTranslator.translatedOne.connect(this.settings.phFirstTranslated);
		this.phTranslator.translatedTwo.connect(this.settings.phSecondTranslated);

		// Hook up controls.
		this.light.connect(ReactiveOp.expr(
			(mode, manualLight, lightTimer)=>{
				if (mode=="manual")
					return manualLight;

				else
					return lightTimer;
			},
			this.settings.mode,
			this.manualControls.light,
			this.lightTimer
		));

		this.pumpMotor.direction.connect(ReactiveOp.expr(
			(mode, manualPump, forward, backward)=>{
				if (mode=="manual")
					return manualPump;

				if (forward)
					return 1;

				if (backward)
					return -1;

				return 0;
			},
			this.settings.mode,
			this.manualControls.pump,
			this.forwardTimer,
			this.backwardTimer
		));

		this.heater.connect(ReactiveOp.expr(
			(mode, manualHeater, tempStatus)=>{
				if (mode=="manual")
					return manualHeater;

				if (tempStatus===undefined)
					return false;

				return !tempStatus;
			},
			this.settings.mode,
			this.manualControls.heater,
			this.tempStatus
		));

		this.fanMotor.direction.connect(ReactiveOp.expr(
			(mode, manualFan, heater)=>{
				if (mode=="manual")
					return manualFan;

				return heater;
			},
			this.settings.mode,
			this.manualControls.fan,
			this.heater
		));
	}

	run() {
		console.log("**** Starting the MBR. ****");

//		this.console=new ReactiveConsole("OpenSeeds MBR");
		this.console=new ReactiveConsoleLogger("OpenSeeds MBR");
		this.console.addWatch("Status: ",this.status);
		this.console.addWatch("Control Mode: ",this.settings.mode);
		this.console.addWatch("REST Conn: ",this.restStatus);
		this.console.addWatch("Temperature: ",this.dhtSensor.temperature);
		this.console.addWatch("Humidity: ",this.dhtSensor.humidity);
		this.console.addWatch("Sensor Error: ",this.dhtSensor.error);
		this.console.addWatch("Heater On: ",this.heater);
		this.console.addWatch("Termostat Temp: ",this.tempStatus.input);
/*		this.console.addWatch("pH Raw:",this.adConverter.value);
		this.console.addWatch("pH:",this.phTranslator);*/
	}
}

module.exports=Mbr;