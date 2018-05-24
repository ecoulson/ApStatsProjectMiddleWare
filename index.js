const DataFile = require('./DataFile');

const SAME_INTERVAL_FILENAME = "functions_out_same_interval";
const DIFFERENT_INTERVAL_FILENAME = "functions_out_diff_interval";

main();

function main() {
	const dataFileReadPromise = readIntegralDataFiles();
	dataFileReadPromise.then((data) => {
		const lines = getLinesFromData(data);
		const query = buildQueryFromLines(lines);
	});
}

function readIntegralDataFiles() {
	const sameIntervalFile = new DataFile(SAME_INTERVAL_FILENAME);
	return sameIntervalFile.readData();
}

function getLinesFromData(data) {
	
}

function buildQueryFromLines(lines) {

}

class Line {
	constructor(functionExpression, interval, result) {
		this.functionExpression = functionExpression;
		this.interval = interval;
		this.result = result;
	}
}