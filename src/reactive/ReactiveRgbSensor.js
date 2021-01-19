const ReactiveValue=require("./ReactiveValue");
const PromiseUtil=require("../util/PromiseUtil");

class ReactiveRgbSensor {
	REG_RDATA=0x14;
	REG_GDATA=0x18;
	REG_BDATA=0x1a;

	constructor(i2c, devId) {
		this.i2c=i2c;
		this.devId=devId;

		this.hue=new ReactiveValue();

		this.update();
	}

	update=async()=>{
		let type=this.i2c.readByteSync(this.devId,0x80 | 0x12);
		let en=this.i2c.readByteSync(this.devId,0x80);
		//console.log("before: "+en);

		this.i2c.writeByteSync(this.devId,0x80,3);

		await PromiseUtil.delay(900);

		en=this.i2c.readByteSync(this.devId,0x80);
		//console.log("after:"+en);

		this.reading={
			alpha: this.i2c.readWordSync(this.devId,0x14 | 0x80),
			red: this.i2c.readWordSync(this.devId,0x16 | 0x80),
			green: this.i2c.readWordSync(this.devId,0x18 | 0x80),
			blue: this.i2c.readWordSync(this.devId,0x1a | 0x80)
		}

		console.log("reading: "+JSON.stringify(this.reading));

		this.i2c.writeByteSync(this.devId,0x80,0);

		this.hue.set(ReactiveRgbSensor.calculateHue(
			this.reading.red,
			this.reading.green,
			this.reading.blue
		));

		setTimeout(this.update,100);
	}

	static calculateHue(r, g, b) {
		let max=Math.max(r,g,b);
		let min=Math.min(r,g,b);
		let diff = max-min;

        if (max == min) 
        	return 0;
  
        else if (max == r) 
           return ((60 * ((g - b) / diff) + 360) % 360);
  
        else if (max == g) 
            return ((60 * ((b - r) / diff) + 120) % 360);
  
        else if (max == b) 
            return ((60 * ((r - g) / diff) + 240) % 360);

        throw new Error("shouldn't happen!!!");
	}

}

module.exports=ReactiveRgbSensor;