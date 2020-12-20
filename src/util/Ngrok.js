const child_process=require("child_process");
const fetch=require("node-fetch");
const PromiseUtil=require("./PromiseUtil");
const which=require("which");

class Ngrok {
	async start() {
		this.stop();

		let ngrokPath=which.sync("ngrok");
		if (!ngrokPath)
			throw new Error("ngrok not found");

		this.subprocess=child_process.spawn(ngrokPath,["tcp","22"]);

		this.subprocess.on("close",this.onProcessClose);
		this.subprocess.on("exit",this.onProcessExit);

		for (let i=0; i<20; i++) {
			await PromiseUtil.delay(1000);

			if (!this.subprocess)
				throw new Error("Unable to start");

			let tunnel=await this.getTunnel();
			if (tunnel)
				return tunnel;
		}
	}

	stop() {
		if (this.subprocess) {
			console.log("killing ngrok..");
			this.subprocess.kill();
			this.cleanup();
		}
	}

	cleanup() {
		this.subprocess.on("close",this.onProcessClose);
		this.subprocess.on("exit",this.onProcessExit);
		this.subprocess=null;
	}

	onProcessClose=()=>{
		if (this.subprocess)
			this.cleanup();
	}

	onProcessExit=(code, signal)=>{
		if (this.subprocess)
			this.cleanup();
	}

	async getTunnel() {
		let response=await fetch("http://localhost:4040/api/tunnels");
		let data=await response.json();

		if (data && data.tunnels && data.tunnels[0] && data.tunnels[0].public_url)
			return data.tunnels[0].public_url;
	}
}

module.exports=Ngrok;