const ReactiveExpression=require("./ReactiveExpression");

class ReactiveOp {
	static not(source) {
		let inverted=new ReactiveExpression((a)=>{
			return !a;
		});

		inverted.param(0).connect(source);

		return inverted;
	}

	static and(...sources) {
		let result=new ReactiveExpression((...params)=>{
			let ret=true;

			for (let param of params)
				ret=(ret && param);

			return ret;
		});

		for (let i=0; i<sources.length; i++)
			result.param(i).connect(sources[i]);

		return result;
	}

	static or(...sources) {
		let result=new ReactiveExpression((...params)=>{
			let ret=false;

			for (let param of params)
				ret=(ret || param);

			return ret;
		});

		for (let i=0; i<sources.length; i++)
			result.param(i).connect(sources[i]);

		return result;
	}

	static if(expr, thenVal, elseVal) {
		let result=new ReactiveExpression((expr,thenVal,elseVal)=>{
			if (expr)
				return thenVal;

			else
				return elseVal;
		});

		result.param(0).connect(expr);
		result.param(1).connect(thenVal);
		result.param(2).connect(elseVal);

		return result;
	}

	static expr(func, ...sources) {
		let result=new ReactiveExpression(func);

		for (let i=0; i<sources.length; i++)
			result.param(i).connect(sources[i]);

		return result;
	}
}

module.exports=ReactiveOp;