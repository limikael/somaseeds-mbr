const ReactiveValue=require("./ReactiveValue");
const Gpio=require('onoff').Gpio;

class ReactiveBlinker {
	constructor(pin) {
		this.pin=pin;
		this.led=new Gpio(this.pin,'out');
		this.led.writeSync(0);
		this.pattern=new ReactiveValue('string');
		this.pattern.set("x ");
		this.patternPos=0;
		setInterval(this.onBlinkInterval,100);
	}

	onBlinkInterval=()=>{
		let pattern=String(this.pattern.get());

		if (this.patternPos>=pattern.length)
			this.patternPos=0;

		if (pattern[this.patternPos]!=" ")
			this.led.writeSync(1);

		else
			this.led.writeSync(0);

		this.patternPos++;
	}
}

module.exports=ReactiveBlinker;