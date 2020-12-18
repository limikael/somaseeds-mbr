const ReactiveValue=require("../reactive/ReactiveValue");

class MbrMockHardware {
	/*light
	heater
	fanDirection
	pumpDirection
	phAd
	temperature
	humidity*/

	constructor() {
		this.light=new ReactiveValue();
		this.heater=new ReactiveValue();
		this.fanDirection=new ReactiveValue();
		this.pumpDirection=new ReactiveValue();

		this.temperature=new ReactiveValue();
	}
}

module.exports=MbrMockHardware;
