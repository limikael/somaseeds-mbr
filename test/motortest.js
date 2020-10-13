const Stepper=require("../src/util/Stepper");

let stepper=new Stepper(16,20,21,26);
stepper.setStepsPerSec(200);
stepper.setDirection(false);

async function main() {
	await stepper.step(200);
	stepper.release();
	console.log("hello");
}

main();