const EventEmitter=require("events");

class ReactiveValue extends EventEmitter {
	constructor(type) {
		super();

		let types=['number','string','number-not-nan','boolean'];

		if (type!==undefined && !types.includes(type))
			throw new Error("Unknown data type: "+type);

		this.type=type;
		this.value=this.processValue(undefined);
	}

	processValue(value) {
		switch (this.type) {
			case 'boolean':
				if (value=="0" || value=="false" || value=="FALSE")
					return false;

				return Boolean(value);

			case 'number':
				return Number(value);

			case 'number-not-nan':
				let n=Number(value);
				if (isNaN(n))
					n=0;

				return n;

			case 'string':
				return String(value);

			default:
				return value;
		}
	}

	connect(source) {
		this.disconnect();

		this.source=source;
		this.source.on("change",this.onSourceChange);
		this.onSourceChange();
	}

	disconnect() {
		if (this.source)
			this.source.off("change",this.onSourceChange);

		this.source=false;
	}

	get() {
		return this.value;
	}

	set(value) {
		if (this.source)
			throw new Error("Can't set a connected value.");

		let newValue=this.processValue(value);
		if (newValue!==this.value) {
			this.value=newValue;
			this.emit("change");
		}
	}

	onSourceChange=()=>{
		let newValue=this.processValue(this.source.value);
		if (newValue!==this.value) {
			this.value=this.source.value;
			this.emit("change");
		}
	}
}

module.exports=ReactiveValue;