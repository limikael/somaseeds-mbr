const EventEmitter=require("events");

class SchmittTrigger extends EventEmitter {
	constructor() {
		super();
		this.state=false;

		this.lowValue=0;
		this.highValue=100;

	}

	setValue(value) {
		if (value>this.highValue)
			this.setState(false);

		if (value<this.lowValue)
			this.setState(true);
	}

	setHighValue(highValue) {
		this.highValue=highValue;
	}

	setLowValue(lowValue) {
		this.lowValue=lowValue;
	}

	setState(state) {
		if (state!=this.state) {
			this.state=state;
			this.emit("stateChange");
		}
	}
}