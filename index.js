const DataFile = require('./DataFile');
const WolframQuery = require('./WolframQuery');
const fetch = require('node-fetch');

const SAME_INTERVAL_FILENAME = "functions_out_same_interval";
const DIFFERENT_INTERVAL_FILENAME = "functions_out_diff_interval";

main();

function main() {
	const dataFileReadPromise = readIntegralDataFiles();
	dataFileReadPromise.then((lines) => {
		return buildQueryFromLines(lines);
	}).then((queries) => {
		return makeRequest(queries);
	}).then((json) => {
		console.log(json);
	});
}

function readIntegralDataFiles() {
	const sameIntervalFile = new DataFile(SAME_INTERVAL_FILENAME);
	return sameIntervalFile.readLines();
}

function buildQueryFromLines(lines) {
	wolframQuery = new WolframQuery(lines);
	return wolframQuery.buildQueries();
}

function makeRequest(queries) {
	return fetch(`http://api.wolframalpha.com/v2/query?appid=RLPQGK-J6UHVVUG64&output=json&input=${encodeURI(queries[0])}`).then((res) => {
		return res.json();
	});
}