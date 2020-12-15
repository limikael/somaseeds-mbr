const ReactiveAdConverter=require("../src/reactive/ReactiveAdConverter");
const ReactiveConsole=require("../src/reactive/ReactiveConsole");

class PhTest {
	constructor() {
		this.adConverter=new ReactiveAdConverter(0);
		this.console=new ReactiveConsole("pH Test");
		this.console.addWatch("Raw pH value: ",this.adConverter.value)
	}	
}

let phTest=new PhTest();
