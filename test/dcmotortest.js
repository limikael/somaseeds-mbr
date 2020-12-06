const i2cbus=require('i2c-bus');
const Mcp23017=require("../src/util/Mcp23017.js");

let i2c=i2cbus.openSync(1);
let port=new Mcp23017(i2c,0x21);

port.writeSync(0,0);
port.writeSync(1,0);
port.writeSync(2,0);
port.writeSync(3,0);
