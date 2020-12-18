const ReactiveValue=require("./ReactiveValue");
const ReactiveTimeout=require("./ReactiveTimeout");

class ReactiveStateSequence extends ReactiveValue {
	constructor(numStates) {
		super();

		this.timeouts=[];

		for (let i=0; i<numStates; i++) {
			let timeout=new ReactiveTimeout();
			this.timeouts.push(timeout);
			timeout.on("timeout",this.onTimeout);
		}

		this.set(-1);
	}

	onTimeout=()=>{
		let currentState=this.get();

		currentState++;

		if (currentState>=this.timeouts.length) {
			this.set(-1);
			this.emit("timeout");
			return;
		}

		this.set(currentState);
		this.timeouts[currentState].start();
	}

	start() {
		this.stop();

		this.set(0);
		this.timeouts[0].start();
	}

	stop() {
		for (let timeout of this.timeouts)
			timeout.stop();

		this.set(-1);
	}

	timeoutDuration(num) {
		return this.timeouts[num].duration;
	}
}

module.exports=ReactiveStateSequence;
