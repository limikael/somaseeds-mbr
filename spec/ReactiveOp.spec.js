const ReactiveOp=require("../src/reactive/ReactiveOp");
const ReactiveValue=require("../src/reactive/ReactiveValue");

describe("ReactiveOp",()=>{
	it("can switch",()=>{
		let v=new ReactiveValue();
		v.set("a");

		let w=ReactiveOp.switch(v,{
			"a": ()=>{
				return "A";
			},
			"b": ()=>{
				return "B";
			}
		});

		expect(w.get()).toBe("A");

		/*v.set(undefined);
		expect(w.get()).toBe(undefined);*/
		v.set("a");
		expect(w.get()).toBe("A");
	});
})