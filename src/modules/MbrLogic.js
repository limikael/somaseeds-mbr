const ReactiveValue=require("../reactive/ReactiveValue");
const ReactiveTimeout=require("../reactive/ReactiveTimeout");
const ReactiveSchmitTrigger=require("../reactive/ReactiveSchmittTrigger");
const ReactiveOp=require("../reactive/ReactiveOp");
const ReactiveStateSequece=require("../reactive/ReactiveStateSequence");
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

		this.floodDuration=new ReactiveValue();
		this.waitDuration=new ReactiveValue();
		this.drainDuration=new ReactiveValue();

		this.pumpSequence=new ReactiveStateSequece(3);
		this.pumpSequence.timeoutDuration(0).connect(this.floodDuration);
		this.pumpSequence.timeoutDuration(1).connect(this.waitDuration);
		this.pumpSequence.timeoutDuration(2).connect(this.drainDuration);

		this.pumpDirection=ReactiveOp.expr(
			(state)=>{
				switch (state) {
					case 0:
						return 1;
						break;

					case 1:
						return 0;
						break;

					case 2:
						return -1;
						break;

					default:
						return 0;
						break;
				}
			},
			this.pumpSequence
		);
	}

	startLight=()=>{
		this.light.start();
	}

	startPump=()=>{
		this.pumpSequence.start();
	}
}

module.exports=MbrLogic;