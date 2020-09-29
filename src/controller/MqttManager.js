const EventEmitter = require('events');
const mqtt=require("mqtt");

class MqttManager extends EventEmitter {
	constructor(settings) {
		super();

		this.settings=settings;
		this.connected=false;
	}

	logSubscribe=(err, granted)=>{
		if (granted && granted[0].topic)
			console.log("** Subscribed to: "+granted[0].topic);

		else
			console.log("** Subscription error: "+err);
	}

	isConnected() {
		if (!this.mqttClient)
			return false;

		return this.mqttClient.connected;
	}

	run() {
		this.mqttClient=mqtt.connect(this.settings.server,{
			username: this.settings.username,
			password: this.settings.password,
			port: this.settings.port
		});

		this.mqttClient.subscribe(this.settings.topic,{},this.logSubscribe);

		this.mqttClient.on("connect",()=>{
			console.log("** Mqtt: Connected.");
			this.emit("statusChange");
		});

		this.mqttClient.on("offline",()=>{
			console.log("** Mqtt: Offline.");
			this.emit("statusChange");
		});

		this.mqttClient.on("error",()=>{
			console.log("** Mqtt: Connection error.");
			this.emit("statusChange");
		});
	}
}

module.exports=MqttManager;