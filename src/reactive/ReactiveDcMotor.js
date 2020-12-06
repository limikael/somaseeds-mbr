const ReactiveValue=require("./ReactiveValue.js");

class RectiveDcMotor {
	constructor(pin0, pin1) {
		this.pin0=pin0;
		this.pin1=pin1;
		this.direction=new ReactiveValue('number');
		this.direction.set(0);
		this.direction.on("change",this.updatePins);

		this.updatePins();
	}

	updatePins=()=>{
		//console.log("settings pins: "+(this.direction.get()<0)+" "+(this.direction.get()<0));

		this.pin0.set(this.direction.get()<0);
		this.pin1.set(this.direction.get()>0);
	}
}

module.exports=RectiveDcMotor;