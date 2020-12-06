const ReactiveExpression=require("./ReactiveExpression");

class ReactiveUtil {
	static invert(source) {
		let inverted=new ReactiveExpression((a)=>{
			return !a;
		});

		inverted.param(0).connect(source);

		return inverted;
	}
}

module.exports=ReactiveUtil;