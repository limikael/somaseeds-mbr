var Mcp3008 = require('mcp3008.js'),
    adc = new Mcp3008(),
    channel = 0;

adc.read(channel, function (value) {
	console.log("got: "+value);
});