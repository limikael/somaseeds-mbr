const Gpio = require('onoff').Gpio;

class Blinker {
	constructor(pin) {
		this.pin=pin;
		this.led=new Gpio(this.pin,'out');
		this.led.writeSync(0);
		this.blinkPattern="x ";
		this.blinkPatternPos=0;
		setInterval(this.onBlinkInterval,100);
	}

	setBlinkPattern(pattern) {
		this.blinkPattern=pattern;
//		this.blinkPatternPos=0;
	}

	onBlinkInterval=()=>{
		if (this.blinkPatternPos>=this.blinkPattern.length)
			this.blinkPatternPos=0;

		if (this.blinkPattern[this.blinkPatternPos]!=" ")
			this.led.writeSync(1);

		else
			this.led.writeSync(0);

		this.blinkPatternPos++;
	}
}

module.exports=Blinker;