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
		const fileNameWithExtension = this.fileName + ".txt";
		const filePath = path.join(PATH_TO_INTEGRAL_DATA, fileNameWithExtension);
		fs.readFile(filePath, ENCODING, function handleDataFileRead(err, data) {
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
			const functionExpression = textLine.substring(10, 50).split("=")[1].trim();
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