/*const Schedule=require("../src/util/Schedule");

let schedule=new Schedule({
	interval: "minute",
	second: 20
});

schedule.on("trigger",()=>{
	console.log("trigger");
});

setTimeout(()=>{
	console.log("done");
},60*60*1000);
*/

const MultiSchedule=require("../src/util/MultiSchedule");

let multi=new MultiSchedule();

multi.on("trigger",()=>{
	console.log("trigger");
});

multi.addSchedule({interval: "minute", second: 0});
multi.addSchedule({interval: "minute", second: 5});
multi.addSchedule({interval: "minute", second: 10});
multi.addSchedule({interval: "minute", second: 15});
multi.addSchedule({interval: "minute", second: 20});
multi.addSchedule({interval: "minute", second: 25});
multi.addSchedule({interval: "minute", second: 30});

//multi.clearSchedules();
