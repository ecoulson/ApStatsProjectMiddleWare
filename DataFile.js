const fs = require('fs');
const path = require('path');
const os = require('os');

const FileLine = require('./FileLine');

const USER_HOME = os.userInfo().homedir;
const PATH_TO_INTEGRAL_DATA = path.join(USER_HOME, "IntegralCalculator");
const ENCODING = "utf-8";

class DataFile {
	constructor(fileName) {
		this.fileName = fileName;
		const fileNameWithExtension = this.fileName + ".txt";
		this.path = path.join(PATH_TO_INTEGRAL_DATA, fileNameWithExtension)
	}

	writeFile(fileLines) {
		let content = "";
		let functionIndex = 0;
		for (let i = 0; i < fileLines.length; i++) {
			if (functionIndex == 30) {
				content += "\n";
				functionIndex = 0;
			}
			content += fileLines[i].toString() + "\n";
			functionIndex++;
		}
		fs.writeFileSync(this.path, content);
	}

	readLines() {
		return this.readData().then((data) => {
			return this.parseLines(data);
		});
	}

	readData() {
		return new Promise(function dataFilePromise(resolve, reject) {
			this.getFileData(resolve, reject);
		}.bind(this));
	}

	getFileData(resolve, reject) {
		fs.readFile(this.path, ENCODING, function handleDataFileRead(err, data) {
			if (err) {
				return reject(err);
			} else {
				return resolve(data);
			}
		});
	}

	parseLines(data) {
		this.lines = [];
		this.textLines = data.split("\n");
		this.currentLine = 0;
		while (this.isReadingLines()) {
			this.addLine();
		}
		return this.lines;
	}

	isReadingLines() {
		return this.currentLine < this.textLines.length;
	}

	addLine() {
		const textLine = this.textLines[this.currentLine];
		if (textLine.length > 0) {
			let functionExpression = textLine.substring(10, 50).split("=")[1].trim();
			if (functionExpression.includes('log')) {
				functionExpression = functionExpression.replace('log', 'log10');
			}
			const interval = textLine.substring(62, 96).trim().split(",");
			const result = textLine.substring(106, 123).trim();
			const fileLine = new FileLine(functionExpression, interval, result);
			this.lines.push(fileLine);
		}
		this.incrementLine();
	}

	incrementLine() {
		this.currentLine++;
	}
}

module.exports = DataFile;