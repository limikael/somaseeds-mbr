const EventEmitter = require('events');
const DhtSensor=require("../util/DhtSensor.js");
const FetchUtil=require("../util/FetchUtil.js");
const Mcp=require("../util/Mcp.js");
const LinearTranslator=require("../util/LinearTranslator.js");

class SensorManager extends EventEmitter {
	constructor(settings) {
		super();

		this.settings=settings;
		this.dhtSensor=new DhtSensor(22,4);
		this.mcp=new Mcp();
		this.status=false;
		this.translator=new LinearTranslator();

		this.updateTranslator();
	}

	updateTranslator() {
		this.translator.setFirstPoint(this.settings.phFirstRaw,this.settings.phFirstTranslated);
		this.translator.setSecondPoint(this.settings.phSecondRaw,this.settings.phSecondTranslated);
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
			ph: this.translator.translate(phRaw),
			phRaw: phRaw
		}
	}

	makeReading=async ()=>{
		try {
			let reading=await this.readValues();
			this.reading=reading;
			this.emit("reading");

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