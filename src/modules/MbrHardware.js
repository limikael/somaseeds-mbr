const ReactiveValue=require("../reactive/ReactiveValue");
const ReactiveOp=require("../reactive/ReactiveOp");
const i2cbus=require('i2c-bus');
const ReactiveMcp23017=require("../reactive/ReactiveMcp23017");
const ReactiveDcMotor=require("../reactive/ReactiveDcMotor");
const ReactiveDhtSensor=require("../reactive/ReactiveDhtSensor");
const ReactiveAdConverter=require("../reactive/ReactiveAdConverter");
const ReactiveBlinker=require("../reactive/ReactiveBlinker");

class MbrHardware {
	constructor() {
		this.light=new ReactiveValue();
		this.heater=new ReactiveValue();
		this.fanDirection=new ReactiveValue();
		this.pumpDirection=new ReactiveValue();
		this.temperature=new ReactiveValue();
		this.humidity=new ReactiveValue();
		this.phRaw=new ReactiveValue();
		this.status=new ReactiveValue();

		// Relays.
		this.i2c=i2cbus.openSync(1);
		this.relayMcp=new ReactiveMcp23017(this.i2c,0x20);
		this.relayMcp.pin(0).connect(ReactiveOp.not(this.heater));
		this.relayMcp.pin(1).connect(ReactiveOp.not(this.light));
		this.relayMcp.pin(2).set(1);
		this.relayMcp.pin(3).set(1);

		// Motors.
		this.motorMcp=new ReactiveMcp23017(this.i2c,0x21);
		this.pumpMotor=new ReactiveDcMotor(this.motorMcp.pin(0),this.motorMcp.pin(1));
		this.fanMotor=new ReactiveDcMotor(this.motorMcp.pin(2),this.motorMcp.pin(3));
		this.pumpMotor.direction.connect(this.pumpDirection);
		this.fanMotor.direction.connect(this.fanDirection);

		// Temp sensor.
		this.dhtSensor=new ReactiveDhtSensor(22,4,1000);
		this.temperature.connect(this.dhtSensor.temperature);
		this.humidity.connect(this.dhtSensor.humidity);

		// pH
		this.adConverter=new ReactiveAdConverter(0);
		this.phRaw.connect(this.adConverter.value);

		this.blinkPattern=ReactiveOp.expr(
			(status)=>{
				if (status)
					return "x                   ";

				return "x ";
			},
			this.status
		);

		this.blinker=new ReactiveBlinker(17);
		this.blinker.pattern.connect(this.blinkPattern);
	}
}

module.exports=MbrHardware;