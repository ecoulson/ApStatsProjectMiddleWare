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

async function main() {
	const lines = await readIntegralDataFiles()
	globalLines = lines;
	const queries = await buildQueryFromLines(lines);
	const queryResults = await makeRequests(queries);
	handleQueryResults(queryResults);
}

async function readIntegralDataFiles() {
	const sameIntervalFile = new DataFile(SAME_INTERVAL_FILENAME);
	return await sameIntervalFile.readLines();
}

function buildQueryFromLines(lines) {
	wolframQuery = new WolframQuery(lines);
	return wolframQuery.buildQueries();
}

async function makeRequests(queries) {
	const queryResults = [];
	for (let i = 0; i < queries.length; i++) {
		console.log(`query ${i+1} / ${queries.length}`);
		let json = await makeRequest(queries[i]);
		queryResults.push(getDataFromResultPods(json));
	}
	return queryResults;
}

async function makeRequest(query, next) {
	return fetch(`http://api.wolframalpha.com/v2/query?appid=TTQAKV-44RXXULUY5&output=json&input=${encodeURIComponent(query)}`).then((res) => {
		return res.json();
	});
}

function getDataFromResultPods(wolframJSON) {
	let res = wolframJSON.queryresult;
	if (res.hasOwnProperty('pods')) {
		for (let i = 0; i < res.pods.length; i++) {
			if (res.pods[i].title == "Result") {
				let result = res.pods[i].subpods[0].plaintext;
				return result;
			}
		}
		return 0;
	} else {
		return 0;
	}
	
	// const result = "{222.60150901745, 18.977096296523, 18.977096296523}";
}

function handleQueryResults(queryResults) {
	const differences = getDifferences(queryResults);
	updateFileLines(queryResults, differences);
	writeUpdatedDataFile();
	writeDifferenceFile();
}

function getDifferences(wolframResults) {
	const differences = [];
	for (let i = 0; i < wolframResults.length; i++) {
		wolframResults[i] = parse("" + wolframResults[i]);
		let diff =  (parseFloat(globalLines[i].result) - parseFloat(wolframResults[i])) / parseFloat(wolframResults[i]);
		if (isNaN(diff)) {
			diff = 0;
		}
		differences.push(diff);
	}
	return differences;
}

function parse(result) {
	if (result.includes('×')) {
		let parts = result.toString().split('×');
		let expParts = parts[1].split('^');
		let num = parts[0] + 'e' + expParts[1];
		return num;
	} else {
		return result;
	}
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