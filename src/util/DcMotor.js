class DcMotor {
	constructor(pin1, pin2) {
		this.pin1=pin1;
		this.pin2=pin2;
		this.speed=0;
	}

	start() {
		this.setSpeed(1);
	}

	stop() {
		this.setSpeed(0);
	}

	setSpeed(speed) {
		this.speed=speed;

		this.pin1.writeSync(speed<0);
		this.pin2.writeSync(speed>0);
	}
}

module.exports=DcMotor;
