const i2cbus=require('i2c-bus');
const ReactiveRgbSensor=require("../src/reactive/ReactiveRgbSensor");
const ReactiveConsoleLogger=require("../src/reactive/ReactiveConsoleLogger");
const PromiseUtil=require("../src/util/PromiseUtil");

async function main() {
	const i2c=i2cbus.openSync(1);
	rgb=new ReactiveRgbSensor(i2c,0x29);

	let logger=new ReactiveConsoleLogger("Reading RGB...");
	logger.addWatch("Hue",rgb.hue);
}

main();