const EventEmitter = require('events');
const mqtt=require("mqtt");
const querystring=require("querystring");

class MqttManager extends EventEmitter {
	constructor(settings, commandManager) {
		super();

		this.settings=settings;
		this.commandManager=commandManager;
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

	onMqttMessage=async (topic, payload)=>{
		let message={...querystring.parse(String(payload))};
		let response={};

		console.log("MQTT message: "+JSON.stringify(message));

		if (message.hasOwnProperty("__res"))
			return;

		if (this.commandManager.actions.includes(message.action)) {
			try {
				response=await this.commandManager[message.action](message);
				response.ok=1;
			}

			catch (e) {
				response.error=String(e);
			}
		}

		else {
			response.error="Unknown command "+message.action;
		}

		response.__res=message.__req;

		this.mqttClient.publish(topic,querystring.stringify(response));
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

		this.mqttClient.on("message",this.onMqttMessage);
	}
}

module.exports=MqttManager;