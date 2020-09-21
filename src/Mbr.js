const mqtt=require("mqtt");
const Blinker=require("./Blinker.js");
/*
//let blinker=new Blinker(17);

const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

let LED = new Gpio(17, 'out'); //use GPIO pin 4, and specify that it is output
LED.writeSync(1);

console.log("starting");
setTimeout(()=>{
	console.log("done..");
	LED.writeSync(0);
},5000);
*/

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
			this.connectionBlinker.setBlinkPattern("xxxxxxxxxxxxxxxxxxx ");
		});

		this.mqttClient.on("offline",()=>{
			console.log("** Mqtt: Offline.");
			this.connectionBlinker.setBlinkPattern("x x                 ");
		});

		this.mqttClient.on("error",()=>{
			console.log("** Mqtt: Connection error.");
			this.connectionBlinker.setBlinkPattern("x x                 ");
		});

		//this.mqttClient.on("message",this.handleMessage);
	}

	run() {
		console.log("Starting the mbr...");
		this.connectionBlinker=new Blinker(17);
		this.connectionBlinker.setBlinkPattern("x");
		this.startMqtt();
	}
}

module.exports=Mbr;