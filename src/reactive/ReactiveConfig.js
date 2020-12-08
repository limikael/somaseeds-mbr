const ReactiveValue=require("./ReactiveValue");
const fs=require("fs");

class ReactiveConfig {
	constructor(fileName, reactiveNames) {
		this.settingsFileName=fileName;
		this.reactiveNames=reactiveNames;

		let settings=JSON.parse(fs.readFileSync(this.settingsFileName));
		for (let name in settings)
			this[name]=settings[name];

		for (let reactiveName of this.reactiveNames) {
			this[reactiveName]=new ReactiveValue();
			this[reactiveName].set(settings[reactiveName]);
			this[reactiveName].on("change",this.save);
		}
	}

	save=()=>{
		let settings=JSON.parse(fs.readFileSync(this.settingsFileName));
		for (let reactiveName of this.reactiveNames)
			settings[reactiveName]=this[reactiveName].get();

		fs.writeFileSync(this.settingsFileName,JSON.stringify(settings,null,2));
	}
}

module.exports=ReactiveConfig;