const Gpio = require('onoff').Gpio;

let relays=[
	new Gpio(5,'out'),
	new Gpio(6,'out'),
	new Gpio(13,'out'),
	new Gpio(19,'out')
];

for (let i=0; i<4; i++)
	relays[i].writeSync(0);
