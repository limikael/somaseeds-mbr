const EventEmitter = require('events');
const DhtSensor=require("../util/DhtSensor.js");
const FetchUtil=require("../util/FetchUtil.js");

class SensorManager extends EventEmitter {
	constructor(settings) {
		super();

		this.settings=settings;
		this.dhtSensor=new DhtSensor(22,4)
		this.status=false;
	}

	getStatus() {
		return this.status;
	}

	makeReading=async ()=>{
		try {
			let vals=await this.dhtSensor.read();
			console.log(vals);

			await FetchUtil.postForm(this.settings.url,{
				var: "temperature",
				value: vals.temperature
			});

			await FetchUtil.postForm(this.settings.url,{
				var: "humidity",
				value: vals.humidity
			});

			this.status=true;
			this.emit("statusChange");
		}

		catch (e) {
			console.log(e);
			this.status=false;
			this.emit("statusChange");
		}

		setTimeout(this.makeReading,5000);
	}

	run() {
		this.makeReading();
	}
}

module.exports=SensorManager;