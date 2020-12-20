const fs=require("fs");
const ApiProxy=require("../util/ApiProxy");
const restbroker=require("restbroker");
const ReactiveValue=require("./ReactiveValue");
const ReactiveConsole=require("./ReactiveConsole");
const ReactiveConsoleLogger=require("./ReactiveConsoleLogger");
const ReactiveIntervalTimer=require("./ReactiveIntervalTimer");

class ReactiveDevice {
	constructor(settingsFileName) {
		this.settingsFileName=settingsFileName;
		this.settings=JSON.parse(fs.readFileSync(this.settingsFileName));
		let commandManager={
			status: params=>this.statusApiCall(params),
			update: params=>this.updateApiCall(params)
		}
		this.apiProxy=new ApiProxy(commandManager);
		this.restClient=new restbroker.Client(this.apiProxy.handleCall);
		this.restClient.setId(this.settings.id);
		this.restClient.setKey(this.settings.apiKey)
		this.restClient.connect(this.settings.brokerUrl);

		this.restStatus=new ReactiveValue('boolean');
		this.restStatus.set(this.restClient.isConnected());
		this.restClient.on("stateChange",()=>{
			this.restStatus.set(this.restClient.isConnected());
		});

		//this.console=new ReactiveConsole("OpenSeeds MBR");
		this.console=new ReactiveConsoleLogger("OpenSeeds MBR");
		this.console.addWatch("Rest Status: ",this.restStatus);

		this.fields=[];
		this.fieldsByKey={};
	}

	async updateApiCall(params) {
		/*console.log("update...");
		console.log(params);*/

		for (let key in params) {
			if (this.fieldsByKey[key]) {
				let field=this.fieldsByKey[key];
				let val=JSON.parse(params[key]);

				this[key].set(val);
				this.save();
			}
		}

		return {
			ok: 1
		};
	}

	save() {
		for (let field of this.fields) {
			if (field.persist)
				this.settings[field.key]=this[field.key].get();
		}

		fs.writeFileSync(this.settingsFileName,JSON.stringify(this.settings,null,2));
	}

	async statusApiCall(params) {
		let res={
			ok:1
		};

		res.fields=[];
		for (let fieldDef of this.fields) {
			let field=fieldDef;
			field.value=this[fieldDef.key].get();
			res.fields.push(field);
		}

		return res;
	}

	addField(key, options) {
		if (this[key])
			throw new Error("Already defined or illegal: "+key);

		options.key=key;

		this.fields.push(options);
		this.fieldsByKey[key]=key;

		let o=null;
		switch (options.type) {
			case "intervaltimer":
				o=new ReactiveIntervalTimer();
				break;

			case "number":
				o=new ReactiveValue("number");
				break;

			case "number-not-nan":
				o=new ReactiveValue("number-not-nan");
				break;

			default:
				o=new ReactiveValue();
				break;
		}

		this[key]=o;
		this[key].set(this.settings[key]);
		this.console.addWatch(options.key+":",this[key]);
	}

	addWatch(label, val) {
		this.console.addWatch(label,val);
	}

	setDeviceDef(def) {
		for (let key in def)
			this.addField(key,def[key]);
	}
}

module.exports=ReactiveDevice;