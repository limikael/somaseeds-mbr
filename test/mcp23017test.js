const Mcp23017=require("../src/util/Mcp23017.js");
const i2cbus=require('i2c-bus');

const i2c=i2cbus.openSync(1);

let mcp=new Mcp23017(i2c,0x20);
mcp.writeSync(0,1);
mcp.writeSync(1,1);
mcp.writeSync(2,1);
mcp.writeSync(3,1);

mcp.writeSync(0,0);
mcp.writeSync(2,0);

/*let pin=mcp.createGPIO(1,'output');
pin.writeSync(1);*/