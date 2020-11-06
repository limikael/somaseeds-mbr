const Stepper=require("../src/util/Stepper");
const Gpio = require('onoff').Gpio;

let gpios=[
	new Gpio(16,'out'),
	new Gpio(20,'out'),
	new Gpio(21,'out'),
	new Gpio(26,'out')
];

for (let i=0; i<gpios.length; i++)
	gpios[i].writeSync(1);
