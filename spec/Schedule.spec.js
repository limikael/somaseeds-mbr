const Schedule=require("../src/util/Schedule");

describe("Schedule",()=>{
	it("triggers",()=>{
		let schedule=new Schedule({
			interval: "minute",
			second: 5
		});

		schedule.on("trigger",()=>{
			console.log("trigger");
		});

		setTimeout(()=>{
			console.log("done");
		},60*60*1000);
	});
});