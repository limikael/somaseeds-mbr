const ReactiveValue=require("./ReactiveValue");
const FetchUtil=require("../util/FetchUtil");

class ReactiveLogger {
	constructor(url) {
		this.url=url;
		this.freq=5000;
		this.error=new ReactiveValue();
		this.fetchOptions={};
		this.data={};

		process.nextTick(this.makeLogEntry);
	}

	setData(key, val) {
		this.data[key]=val;
	}

	makeLogEntry=async ()=>{
		let useData={};
		let dataOk=true;

		for (let key in this.data) {
			if (this.data[key] instanceof ReactiveValue)
				useData[key]=this.data[key].get();

			else
				useData[key]=this.data[key];

			if (useData[key]===undefined)
				dataOk=false;
		}

		if (dataOk) {
			try {
				await FetchUtil.postForm(this.url,useData);
				this.error.set(null);
			}

			catch (e) {
				this.error.set(String(e));
			}
		}

		setTimeout(this.makeLogEntry,this.freq);
	}
}

module.exports=ReactiveLogger;