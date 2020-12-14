class ReactiveConsoleLogger {
	constructor(label) {
		this.label=label;

		console.log(this.label);
		console.log("--------------------------------------------------------------------------------");
	}

	addWatch(label, value) {
		value.on("change",this.update.bind(this,label,value));

		this.update(label,value);
	}

	update=(label, value)=>{
		console.log(label+"\t"+value.get());
	}
}

module.exports=ReactiveConsoleLogger;