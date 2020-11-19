const EventEmitter = require('events');
const DhtSensor=require("../util/DhtSensor.js");
const FetchUtil=require("../util/FetchUtil.js");
const Mcp=require("../util/Mcp.js");

class SensorManager extends EventEmitter {
	constructor(settings) {
		super();

		this.settings=settings;
		this.dhtSensor=new DhtSensor(22,4);
		this.mcp=new Mcp();
		this.status=false;
	}

	getStatus() {
		return this.status;
	}

	async readValues() {
		let dhtVals=await this.dhtSensor.read();
		let phRaw=await this.mcp.read();

		return {
			temperature: dhtVals.temperature,
			humidity: dhtVals.humidity,
			ph: 0,
			phRaw: phRaw
		}
	}

	makeReading=async ()=>{
		try {
			let reading=await this.readValues();
			console.log("temp: "+reading.temperature+" humidity: "+reading.humidity+" phRaw: "+reading.phRaw);

			await FetchUtil.postForm(this.settings.url,{
				var: "temperature",
				value: reading.temperature
			});

			await FetchUtil.postForm(this.settings.url,{
				var: "humidity",
				value: reading.humidity
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