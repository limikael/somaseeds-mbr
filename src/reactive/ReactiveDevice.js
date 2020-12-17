const fs=require("fs");
const ApiProxy=require("../util/ApiProxy");
const restbroker=require("restbroker");
const ReactiveValue=require("./ReactiveValue");
const ReactiveConsole=require("./ReactiveConsole");
const ReactiveConsoleLogger=require("./ReactiveConsoleLogger");

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
		for (let key in params) {
			if (this.fieldsByKey[key]) {
				this[key].set(params[key])
			}
		}

		return {
			ok: 1
		};
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
		options.key=key;

		this.fields.push(options);
		this.fieldsByKey[key]=key;

		this[key]=new ReactiveValue();
		this[key].set(this.settings[key]);
		this.console.addWatch(options.key+":",this[key]);
	}
}

module.exports=ReactiveDevice;