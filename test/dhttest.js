const DhtSensor=require("../src/util/DhtSensor.js");

async function main() {
	let sensor=new DhtSensor(22,4);
	let v=await sensor.read();
	console.log(v);
}

main();