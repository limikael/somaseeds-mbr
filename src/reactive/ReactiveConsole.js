class ReactiveConsole {
	constructor(label) {
		this.watches=[];
		this.update();

		this.label=label;
	}

	addWatch(label, value) {
		this.watches.push({
			label: label,
			value: value
		});

		value.on("change",this.update);

		this.update();
	}

	update=()=>{
		console.clear();

		console.log(this.label);
		console.log("--------------------------------------------------------------------------------");
		console.log();

		for (let watch of this.watches) {
			console.log(watch.label+"\t"+watch.value.get());
		}
	}
}

module.exports=ReactiveConsole;