class Mcp23017GPIO {
	constructor(mcp, pin) {
		this.mcp=mcp;
		this.pin=pin;
	}

	writeSync(val) {
		this.mcp.writeSync(this.pin,val);
	}
}

class Mcp23017 {
	constructor(i2c, devId) {
		this.i2c=i2c;
		this.devId=devId;
		this.pins=0x00;
		this.updatePinsCnt=0;
		//this.dirty=false;

		// Set all pins as output.
		this.i2c.writeByteSync(this.devId,0x00,0x00);
		this.updatePins();
	}

	updatePins=()=>{
		//this.dirty=false;
		this.updatePinsCnt++;
		//console.log("updating pins... "+this.updatePinsCnt);
		try {
			this.i2c.writeByteSync(this.devId,0x14,this.pins);
		}

		catch (e) {
			console.log("warning... I2C write error: "+e);
		}
	}

	writeSync(pin, val) {
		if (val)
			this.pins|=(1<<pin);

		else
			this.pins&=~(1<<pin);

		/*if (!this.dirty) {
			this.dirty=true;
			process.nextTick(this.updatePins); //();
		}*/

		this.updatePins();
	}

	createGPIO(pin, mode) {
		if (mode!="output")
			throw new Error("Only output implemented!!!");

		return new Mcp23017GPIO(this,pin);
	}
}

module.exports=Mcp23017;