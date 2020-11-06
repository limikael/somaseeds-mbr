const Gpio = require('onoff').Gpio;
const i2cbus=require('i2c-bus');
const Mcp23017=require("../src/util/Mcp23017.js");

const i2c=i2cbus.openSync(1);
let mcp=new Mcp23017(i2c,0x21);

let gpios=[
	mcp.createGPIO(0,'output'),
	mcp.createGPIO(1,'output'),
	mcp.createGPIO(2,'output'),
	mcp.createGPIO(3,'output')
];

for (let i=0; i<4; i++)
	gpios[i].writeSync(0);
