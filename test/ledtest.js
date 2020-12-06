const Gpio = require('onoff').Gpio;
let led=new Gpio(17,'out');
led.writeSync(1);