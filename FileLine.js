class FileLine {
	constructor(functionExpression, interval, result) {
		this.functionExpression = functionExpression;
		this.interval = interval;
		this.result = result;
		this.wolframResult = null;
		this.difference = null;
	}

	toString() {
		let string = "function: ";
		string += this.functionExpression;
		while (string.length < 50) {
			string += " ";
		}
		string += "interval: (" + this.interval[0] + ", " + this.interval[1] + ")";
		while (string.length < 98) {
			string += " ";
		}
		string += "estimated result: " + this.result;
		while (string.length < 134) {
			string += " ";
		}
		string += "actual result: " + this.wolframResult;
		while (string.length < 167) {
			string += " ";
		}
		string += "difference: " + this.difference;
		while (string.length < 197) {
			string += " ";
		}
		return string;
	}
}

module.exports = FileLine;