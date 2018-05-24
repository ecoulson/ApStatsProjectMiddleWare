const DataFile = require('./DataFile');
const WolframQuery = require('./WolframQuery');

const SAME_INTERVAL_FILENAME = "functions_out_same_interval";
const DIFFERENT_INTERVAL_FILENAME = "functions_out_diff_interval";

main();

function main() {
	const dataFileReadPromise = readIntegralDataFiles();
	dataFileReadPromise.then((lines) => {
		return buildQueryFromLines(lines);
	}).then((query) => {
		
	});
}

function readIntegralDataFiles() {
	const sameIntervalFile = new DataFile(SAME_INTERVAL_FILENAME);
	return sameIntervalFile.readLines();
}

function buildQueryFromLines(lines) {
	wolframQuery = new WolframQuery(lines);
	return wolframQuery.buildQuery();
}