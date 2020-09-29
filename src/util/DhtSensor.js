const sensor=require("node-dht-sensor");

class DhtSensor {
	constructor(type, pin) {
		this.type=type;
		this.pin=pin;
	}

	read() {
		return new Promise((resolve,reject)=>{
			sensor.read(this.type,this.pin,(err, temperature, humidity)=>{
				if (err) {
					reject(err);
					return;
				}

				resolve({
					temperature: temperature,
					humidity: humidity
				});
			});
		});
	}
}

module.exports=DhtSensor;
