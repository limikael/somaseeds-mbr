const ReactiveValue=require("../reactive/ReactiveValue");

class MbrMockHardware {
	constructor() {
		this.light=new ReactiveValue();
		this.heater=new ReactiveValue();
		this.fanDirection=new ReactiveValue();
		this.pumpDirection=new ReactiveValue();
		this.temperature=new ReactiveValue();
		this.humidity=new ReactiveValue();
		this.phRaw=new ReactiveValue();
		this.status=new ReactiveValue();

		this.temperature.set(32);
		this.phRaw.set(512);
	}
}

module.exports=MbrMockHardware;
