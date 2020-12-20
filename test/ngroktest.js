const Ngrok=require("../src/util/Ngrok");
const PromiseUtil=require("../src/util/PromiseUtil");

async function main() {
	ngrok=new Ngrok();
	await ngrok.start();

	console.log(await ngrok.getTunnel());
	ngrok.stop();

	console.log("done");
}

main();
