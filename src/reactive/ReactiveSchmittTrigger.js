const ReactiveValue=require("./ReactiveValue");

class ReactiveSchmitTrigger extends ReactiveValue {
	constructor() {
		super();

		this.high=new ReactiveValue();
		this.low=new ReactiveValue();
		this.input=new ReactiveValue();

		this.high.on("change",this.update);
		this.low.on("change",this.update);
		this.input.on("change",this.update);

		this.update();
	}

	update=()=>{
		let high=Number(this.high.get());
		let low=Number(this.low.get());
		let input=Number(this.input.get());

		if (isNaN(high) || isNaN(low) || isNaN(input)) {
			this.set(undefined);
			return;
		}

		if (input<low)
			this.set(false);

		if (input>high)
			this.set(true);

		if (this.get()===undefined)
			this.set(false);
	}
}

module.exports=ReactiveSchmitTrigger;