const Mcp3008=require('mcp3008.js');

class Mcp {
	constructor(dev, channel) {
		if (!channel)
			channel=0;

		this.channel=channel;
		this.mcp3008=new Mcp3008();
	}

	read() {
		return new Promise((resolve, reject)=>{
			this.mcp3008.read(this.channel, function (value) {
				resolve(value);
			});			
		});
	}
}

module.exports=Mcp;