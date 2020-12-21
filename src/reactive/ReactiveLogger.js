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
		if (!this.url)
			return;

		let useData={};
		let dataOk=true;
		let logFields=[];

		for (let key in this.data) {
			if (this.data[key] instanceof ReactiveValue) {
				let val=this.data[key].get();

				if (val!==undefined)
					useData[key]=val;

				logFields.push(key);
			}

			else
				useData[key]=this.data[key];
		}

		try {
			await FetchUtil.postForm(this.url,useData);
			this.error.set(null);
		}

		catch (e) {
			console.log("error sending log: "+String(e));
			this.error.set(String(e));
		}

		setTimeout(this.makeLogEntry,this.freq);
	}
}

module.exports=ReactiveLogger;