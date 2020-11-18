class LinearTranslator {
	constructor() {
	}

	setFirstPoint(value, translatedValue) {
		this.first={
			value: value,
			translatedValue: translatedValue
		}
	}

	setSecondPoint(value, translatedValue) {
		this.second={
			value: value,
			translatedValue: translatedValue
		}
	}

	translate(value) {
		if (!this.first || !this.second)
			throw new Error("Translation points needs to be set first.");

		let weigth=(value-this.first.value)/(this.second.value-this.first.value);

		return this.first.translatedValue+
			weigth*(this.second.translatedValue-this.first.translatedValue)

		return value;
	}
}

module.exports=LinearTranslator;
