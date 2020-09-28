const mqtt=require("mqtt");
const Blinker=require("./Blinker.js");
const sensor=require("node-dht-sensor");
const querystring=require("querystring");

class Mbr {
	constructor(settings) {
		this.settings=settings;
	}

	logSubscribe=(err, granted)=>{
		if (granted && granted[0].topic)
			console.log("** Subscribed to: "+granted[0].topic);

		else
			console.log("** Subscription error: "+err);
	}

	startMqtt() {
		this.connectionBlinker.setBlinkPattern("x ");
		this.mqttClient=mqtt.connect(this.settings.server,{
			username: this.settings.username,
			password: this.settings.password,
			port: this.settings.port
		});

		this.mqttClient.subscribe(this.settings.topic,{},this.logSubscribe);

		this.mqttClient.on("connect",()=>{
			console.log("** Mqtt: Connected.");
			this.connectionBlinker.setBlinkPattern("x                    ");
		});

		this.mqttClient.on("offline",()=>{
			console.log("** Mqtt: Offline.");
			this.connectionBlinker.setBlinkPattern("x ");
		});

		this.mqttClient.on("error",()=>{
			console.log("** Mqtt: Connection error.");
			this.connectionBlinker.setBlinkPattern("x ");
		});

		//this.mqttClient.on("message",this.handleMessage);
	}

	onMeasureInterval=()=>{
		sensor.read(22,4,(err, temperature, humidity)=>{
			if (err) {
				console.log("Sensor error: "+err);
				return;
			}

			this.mqttClient.publish("mbr",querystring.stringify({var: "temperature", value: temperature}));
			this.mqttClient.publish("mbr",querystring.stringify({var: "humidity", value: humidity}));

			console.log(`## temp: ${temperature}°C, humidity: ${humidity}%`);
		});
	}

	run() {
		console.log("Starting the mbr...");
		this.connectionBlinker=new Blinker(17);
		this.connectionBlinker.setBlinkPattern("x");
		this.startMqtt();
		setInterval(this.onMeasureInterval,5000);
	}
}

module.exports=Mbr;