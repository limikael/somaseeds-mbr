const ReactiveValue=require("./ReactiveValue.js");
const Mcp3008=require('mcp3008.js');

class ReactiveAdConverter {
	constructor(channel) {
		this.adc=new Mcp3008();
		this.channel=channel;
		this.freq=1000;

		this.value=new ReactiveValue();

		this.makeReading();
	}

	makeReading=()=>{
		this.adc.read(this.channel,(value)=>{
			this.value.set(value);
			setTimeout(this.makeReading,this.freq);
		});
	}
}

module.exports=ReactiveAdConverter;
