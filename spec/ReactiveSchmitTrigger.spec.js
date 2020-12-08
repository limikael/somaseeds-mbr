const ReactiveSchmittTrigger=require("../src/reactive/ReactiveSchmittTrigger");

describe("ReactiveSchmittTrigger",()=>{
	it("triggers",()=>{
		let trigger=new ReactiveSchmittTrigger();
		expect(trigger.get()).toBe(undefined);

		trigger.high.set(10);
		trigger.low.set(5);
		trigger.input.set(3);

		expect(trigger.get()).toBe(false);

		trigger.input.set(7);
		expect(trigger.get()).toBe(false);

		trigger.input.set(11);
		expect(trigger.get()).toBe(true);

		trigger.input.set(7);
		expect(trigger.get()).toBe(true);

		trigger.input.set(undefined);
		expect(trigger.get()).toBe(undefined);

		trigger.input.set(7);
		expect(trigger.get()).toBe(false);
	});
});