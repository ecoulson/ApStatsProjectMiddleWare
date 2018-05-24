const fs = require('fs');
const path = require('path');
const os = require('os');

const USER_HOME = os.userInfo().homedir;
const PATH_TO_INTEGRAL_DATA = path.join(USER_HOME, 'IntegralCalculator');
const SAME_INTERVAL_FILENAME = "functions_out_same_interval";
const DIFFERENT_INTERVAL_FILENAME = "functions_out_diff_interval";
const ENCODING = "utf-8";

function readIntegralDataFiles() {
	return readDataFile(SAME_INTERVAL_FILENAME).then((data) => {
		console.log(data);
	});
}

readIntegralDataFiles();

function readDataFile(fileName) {
	return new Promise(function dataFilePromise(resolve, reject) {
		const fileNameWithExtension = fileName + ".txt";
		const filePath = path.join(PATH_TO_INTEGRAL_DATA, fileNameWithExtension);
		fs.readFile(filePath, ENCODING, function handleDataFileRead(err, data) {
			if (err) {
				return reject(err);
			} else {
				return resolve(data);
			}
		});
	});
}