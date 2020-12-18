const Schedule=require("../src/util/Schedule");

describe("Schedule",()=>{
	it("triggers",()=>{
		let schedule=new Schedule();
		schedule.setInterval("minute",{
			h: 0,
			m: 0,
			s: 5
		});

		schedule.on("trigger",()=>{
			console.log("trigger");
		});

		schedule.start();

		setTimeout(()=>{
			console.log("done");
		},60*60*1000);
	});
});