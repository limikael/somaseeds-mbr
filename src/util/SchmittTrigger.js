const EventEmitter=require("events");

class SchmittTrigger extends EventEmitter {
	constructor() {
		super();
		this.state=false;
		this.lowValue=0;
		this.highValue=100;
		this.value=0;
	}

	setValue(value) {
		this.value=value;
		this.updateState();
	}

	setHighValue(highValue) {
		this.highValue=Number(highValue);
		this.updateState();
	}

	setLowValue(lowValue) {
		this.lowValue=Number(lowValue);
		this.updateState();
	}

	updateState() {
		if (this.value>this.highValue)
			this.setState(true);

		if (this.value<this.lowValue)
			this.setState(false);
	}

	setState(state) {
		if (state!=this.state) {
			this.state=state;
			this.emit("stateChange");
		}
	}

	getState() {
		return this.state;
	}
}

module.exports=SchmittTrigger;