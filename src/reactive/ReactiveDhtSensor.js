const sensor=require("node-dht-sensor");
const ReactiveValue=require("./ReactiveValue.js");

class ReactiveDhtSensor {
	constructor(type, pin, freq) {
		this.type=type;
		this.pin=pin;
		this.freq=freq;

		this.temperature=new ReactiveValue();
		this.humidity=new ReactiveValue();
		this.error=new ReactiveValue();

		this.makeReading();
	}

	makeReading=()=>{
		sensor.read(this.type,this.pin,(err, temperature, humidity)=>{
			this.temperature.set(temperature);
			this.humidity.set(humidity);
			this.error.set(err);

			setTimeout(this.makeReading,this.freq);
		});
	}
}

module.exports=ReactiveDhtSensor;
