const ReactiveValue=require("./ReactiveValue.js");

class ReactiveExpression extends ReactiveValue {
	constructor(func) {
		super();

		this.func=func;
		this.params=[];
		this.evaluate();
	}

	param(num) {
		if (!this.params[num]) {
			this.params[num]=new ReactiveValue();
			this.params[num].on("change",this.evaluate);
		}

		return this.params[num];
	}

	evaluate=()=>{
		if (!this.func)
			return;

		let funcParams=[];
		for (let param of this.params)
			if (param)
				funcParams.push(param.get());

			else
				funcParams.push(undefined);

		let res=this.func.apply(null,funcParams);
		this.set(res);
	}
}

module.exports=ReactiveExpression;