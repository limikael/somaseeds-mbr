const ReactiveValue=require("../reactive/ReactiveValue");
const ReactiveTimeout=require("../reactive/ReactiveTimeout");
const ReactiveSchmitTrigger=require("../reactive/ReactiveSchmittTrigger");
const ReactiveOp=require("../reactive/ReactiveOp");

/*
		light
		heater
		fan
		pumpDirection

		tempTarget
		tempTolerance
*/

class MbrLogic {
	constructor() {
		this.lightDuration=new ReactiveValue();
		this.light=new ReactiveTimeout();
		this.light.duration.connect(this.lightDuration);

		this.temperature=new ReactiveValue();
		this.tempTarget=new ReactiveValue();
		this.tempTolerance=new ReactiveValue();

		this.tempTrigger=new ReactiveSchmitTrigger();
		this.tempTrigger.input.connect(this.temperature);
		this.tempTrigger.high.connect(ReactiveOp.expr(
			(tempTarget,tempTolerance)=>{
				return Number(tempTarget)+Number(tempTolerance);
			},
			this.tempTarget,
			this.tempTolerance
		));
		this.tempTrigger.low.connect(ReactiveOp.expr(
			(tempTarget,tempTolerance)=>{
				return Number(tempTarget)-Number(tempTolerance);
			},
			this.tempTarget,
			this.tempTolerance
		));

		this.heater=new ReactiveValue();
		this.heater.connect(ReactiveOp.not(this.tempTrigger));

		this.fanDirection=new ReactiveValue();
		this.fanDirection.connect(ReactiveOp.expr(
			heater=>(heater?1:0),
			this.heater
		));
	}

	startLight=()=>{
		this.light.start();
	}
}

module.exports=MbrLogic;