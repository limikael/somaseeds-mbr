const ReactiveStateSequence=require("../src/reactive/ReactiveStateSequence");
const ReactiveConsoleLogger=require("../src/reactive/ReactiveConsoleLogger");

let sequence=new ReactiveStateSequence(3);
let logger=new ReactiveConsoleLogger();
logger.addWatch("Sequece: ",sequence);

sequence.timeoutDuration(0).set(1000);
sequence.timeoutDuration(1).set(500);
sequence.timeoutDuration(2).set(1000);

sequence.start();