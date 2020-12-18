const ReactiveValue=require("./ReactiveValue");

class ReactiveTimeout extends ReactiveValue {
	constructor() {
		super();

		this.duration=new ReactiveValue();
		this.duration.on("change",this.onDurationChange)
		this.set(false);
	}

	onDurationChange=()=>{
		if (!this.started)
			return;

		if (!this.duration.get()) {
			this.stop();
			this.emit("timeout");
			return;
		}

		let now=Date.now();
		let shouldFinish=this.started+this.duration.get();

		if (now>shouldFinish) {
			this.stop();
			this.emit("timeout");
			return;
		}

		clearTimeout(this.timeout);
		this.timeout=setTimeout(this.onTimeout,shouldFinish-now);
	}

	onTimeout=()=>{
		this.stop();
		this.emit("timeout");
	}

	start() {
		this.stop();
		this.started=Date.now();

		if (this.duration.get()) {
			this.timeout=setTimeout(this.onTimeout,this.duration.get());
			this.set(true);
		}
	}

	stop() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout=null;
			this.started=null;
		}

		this.set(false);
	}
}

module.exports=ReactiveTimeout;