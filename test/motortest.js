const Stepper=require("../src/util/Stepper");
const i2cbus=require('i2c-bus');
const Mcp23017=require("../src/util/Mcp23017.js");

const i2c=i2cbus.openSync(1);
let mcp=new Mcp23017(i2c,0x21);

let stepper=new Stepper(

	mcp.createGPIO(0,'output'),
	mcp.createGPIO(1,'output'),
	mcp.createGPIO(2,'output'),
	mcp.createGPIO(3,'output')
);

stepper.setStepsPerSec(200);
stepper.setDirection(false);

async function main() {
	console.log("stepping...");
	await stepper.step(200);
	stepper.release();
	console.log("done");
}

main();