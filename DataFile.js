const fs = require('fs');
const path = require('path');
const os = require('os');

const USER_HOME = os.userInfo().homedir;
const PATH_TO_INTEGRAL_DATA = path.join(USER_HOME, "IntegralCalculator");
const ENCODING = "utf-8";

class DataFile {
	constructor(fileName) {
		this.fileName = fileName;
	}

	readData(resolve, reject) {
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
}

module.exports = DataFile;