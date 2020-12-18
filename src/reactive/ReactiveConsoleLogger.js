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
		let d=new Date();

		let s="[ "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"] ";

		console.log(s+label+"\t"+value.get());
	}
}

module.exports=ReactiveConsoleLogger;