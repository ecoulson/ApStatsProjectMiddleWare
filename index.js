const DataFile = require('./DataFile');
const WolframQuery = require('./WolframQuery');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const fs = require('fs');

const SAME_INTERVAL_FILENAME = "functions_out_same_interval";
const DIFFERENT_INTERVAL_FILENAME = "functions_out_diff_interval";
const JSON_DATA_FILE_NAME = "complete_sampling_data";

const USER_HOME = os.userInfo().homedir;
const PATH_TO_INTEGRAL_DATA = path.join(USER_HOME, "IntegralCalculator");

main();
let globalLines = [];

function main() {
	const dataFileReadPromise = readIntegralDataFiles();
	dataFileReadPromise.then((lines) => {
		globalLines = lines;
		return buildQueryFromLines(lines);
	}).then((queries) => {
		return makeRequests(queries);
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

function makeRequests(queries) {
	let i = 0;
	const request = makeRequest(queries[i]);
	const queryResults = [];
	makeRequest(queries[i]).then((json) => {
		const resultData = getDataFromResultPods(json);
		queryResults.push(resultData);
		makeRequestHelper(queries, queryResults, i + 1);
	});
}

function makeRequest(query) {
	// return new Promise((resolve, reject) => {
	// 	setTimeout(() => {
	// 		resolve({a: 1, b: 2, c:2});
	// 	}, 10);
	// });
	return fetch(`http://api.wolframalpha.com/v2/query?appid=RLPQGK-J6UHVVUG64&output=json&input=${encodeURI(query)}`).then((res) => {
		return res.json();
	});
}

function makeRequestHelper(queries, queryResults, i) {
	if (i < queries.length) {
		makeRequest(queries[i]).then((json) => {
			const resultData = getDataFromResultPods(json);
			queryResults.push(resultData);
			makeRequestHelper(queries, queryResults, i + 1);
		});
	} else {
		handleQueryResults(queryResults);
	}
}

function getDataFromResultPods(wolframJSON) {
	let res = wolframJSON.queryresult;
	for (let i = 0; i < res.numpods; i++) {
		if (res.pods[i].title == "Result") {
			let result = res.pods[i].subpods[0].plaintext;
			return result.substring(1, result.length - 1).split(',');
		}
	}
	// const result = "{222.60150901745, 18.977096296523, 18.977096296523}";
}

function handleQueryResults(queryResults) {
	const wolframResults = flatten(queryResults);
	const differences = getDifferences(wolframResults);
	updateFileLines(wolframResults, differences);
	writeUpdatedDataFile();
	writeDifferenceFile();
}

function flatten(queryResults) {
	const results = [];
	for (let i = 0; i < queryResults.length; i ++) {
		results.push(queryResults[i][0]);
		results.push(queryResults[i][1]);
		results.push(queryResults[i][2]);
	}
	return results;
}

function getDifferences(wolframResults) {
	const differences = [];
	for (let i = 0; i < wolframResults.length; i++) {
		let diff = parseFloat(wolframResults[i]) - parseFloat(globalLines[i].result);
		if (isNaN(diff)) {
			diff = 0;
		}
		differences.push(diff);
	}
	return differences;
}

function updateFileLines(results, differences) {
	for (let i = 0; i < results.length; i++) {
		globalLines[i].wolframResult = results[i];
		globalLines[i].difference = differences[i];
	}
}

function writeUpdatedDataFile() {
	let dataFile = new DataFile(JSON_DATA_FILE_NAME);
	dataFile.writeFile(globalLines);
}

function writeDifferenceFile() {
	let filePath = path.join(PATH_TO_INTEGRAL_DATA, "differences.txt");
	let content = "[\n";
	for (let i = 0; i < globalLines.length; i++) {
		content += "\t" + globalLines[i].difference;
		if (i < globalLines.length - 1) {
			content += ",";
		}
		content += "\n";
	}
	content += "]";
	fs.writeFileSync(filePath, content);	
}