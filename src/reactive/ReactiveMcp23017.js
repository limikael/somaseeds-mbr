const ReactiveValue=require("./ReactiveValue");

class ReactiveMcp23017 {
	constructor(i2c, devId) {
		this.i2c=i2c;
		this.devId=devId;
		this.i2c.writeByteSync(this.devId,0x00,0x00);

		this.pins=[];
		for (let i=0; i<8; i++) {
			let pin=new ReactiveValue('boolean');
			pin.set(false);
			pin.on('change',this.onPinChange);
			this.pins.push(pin);
		}

		this.dirty=true;
		process.nextTick(this.updatePins);
	}

	onPinChange=()=>{
		if (!this.dirty) {
			this.dirty=true;
			process.nextTick(this.updatePins);
		}
	}

	updatePins=()=>{
		let val=0;
		for (let i=0; i<8; i++)
			if (this.pins[i].get())
				val|=(1<<i);

		val=val;
		this.dirty=false;

		//this.i2c.writeByteSync(this.devId,0x00,0x00);
		this.i2c.writeByteSync(this.devId,0x14,val);
	}

	pin(num) {
		return this.pins[num];
	}
}

module.exports=ReactiveMcp23017;