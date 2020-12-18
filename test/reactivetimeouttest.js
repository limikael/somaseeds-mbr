const ReactiveTimeout=require("../src/reactive/ReactiveTimeout");

let r=new ReactiveTimeout();

r.on("timeout",()=>{console.log("hello")});

r.duration.set(10000);
r.start();

r.duration.set(2000);
