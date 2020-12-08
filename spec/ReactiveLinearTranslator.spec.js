const ReactiveLinearTranslator=require("../src/reactive/ReactiveLinearTranslator");

describe("ReactiveLinearTranslator",()=>{
	it("translates",()=>{
		let translator=new ReactiveLinearTranslator();
		expect(translator.get()).toBeNaN();

		translator.measuredOne.set(100);
		translator.measuredTwo.set(200);
		translator.translatedOne.set(4);
		translator.translatedTwo.set(5);

		translator.input.set(150);
		expect(translator.get()).toBe(4.5);

		translator.input.set(100);
		expect(translator.get()).toBe(4);
	});
});