		/*ReactiveOp.switch(this.device.mode,{
			"manual": ()=>{
				this.hw.light.connect(this.device.manualLight);
				this.hw.pumpDirection.connect(this.device.manualPump);
				this.hw.heater.connect(this.device.manualHeater);
				this.hw.fanDirection.connect(this.device.manualFan);
			},
			"auto": ()=>{
				this.hw.light.connect(this.logic.light);
				this.hw.pumpDirection.connect(this.logic.pumpDirection);
				this.hw.heater.connect(this.logic.heater);
				this.hw.fanDirection.connect(this.logic.fanDirection);
				this.logic.temperature.connect(this.hw.temperature);
			},
			"debug": ()=>{
				this.hw.light.connect(this.logic.light);
				this.hw.pumpDirection.connect(this.logic.pumpDirection);
				this.hw.heater.connect(this.logic.heater);
				this.hw.fanDirection.connect(this.logic.fanDirection);
				this.logic.temperature.connect(this.device.debugTemp);
			}
		});*/