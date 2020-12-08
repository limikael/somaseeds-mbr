const ReactiveValue=require("./ReactiveValue");

class ReactiveLinearTranslator extends ReactiveValue {
	constructor() {
		super();

		this.measuredOne=new ReactiveValue();
		this.translatedOne=new ReactiveValue();
		this.measuredTwo=new ReactiveValue();
		this.translatedTwo=new ReactiveValue();
		this.input=new ReactiveValue();

		this.measuredOne.on("change",this.translate);
		this.translatedOne.on("change",this.translate);
		this.measuredTwo.on("change",this.translate);
		this.translatedTwo.on("change",this.translate);
		this.input.on("change",this.translate);

		this.translate();
	}

	translate=()=>{
		let measuredOne=Number(this.measuredOne.get());
		let translatedOne=Number(this.translatedOne.get());
		let measuredTwo=Number(this.measuredTwo.get());
		let translatedTwo=Number(this.translatedTwo.get());
		let input=Number(this.input.get());

		if (isNaN(measuredOne)
				|| isNaN(translatedOne)
				|| isNaN(measuredTwo)
				|| isNaN(translatedTwo)
				|| isNaN(input)) {
			this.set(NaN);
			return;
		}

		let weigth=(input-measuredOne)/(measuredTwo-measuredOne);
		let translated=translatedOne+
			weigth*(translatedTwo-translatedOne);

		this.set(translated);
	}
}

module.exports=ReactiveLinearTranslator;
