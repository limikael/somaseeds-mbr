const Stepper=require("../src/util/Stepper");
const Gpio = require('onoff').Gpio;

let stepper=new Stepper(
	new Gpio(16,'out'),
	new Gpio(20,'out'),
	new Gpio(21,'out'),
	new Gpio(26,'out')
);

stepper.setStepsPerSec(400);
stepper.setDirection(false);

async function main() {
	console.log("stepping...");
	await stepper.step(20000);
	stepper.release();
	console.log("done");
}

main();
