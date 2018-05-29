const QUERY_START = "SetPrecision[";
const QUERY_END = ", 14]";

class WolframQuery {
	constructor(lines) {
		this.lines = lines;
		this.queries = [];
		this.queryPOS = 0;
	}

	buildQueries() {
		for (let j = 0; j < 900; j++) {
			this.query = QUERY_START;
			this.buildIntegrateQuery(this.lines[this.queryPOS]);
			this.queryPOS++;
			this.query += QUERY_END;
			this.queries.push(this.query);
		}
		return this.queries;
	}

	buildIntegrateQuery(line) {
		let subQuery = "(integrate ";
		subQuery += line.functionExpression + ", ";
		line.interval[0] = line.interval[0].substring(1, line.interval[0].length);
		subQuery += "x=" + line.interval[0].trim() + "," + line.interval[1].trim();
		subQuery += ")";
		this.query += subQuery;
	}
}

module.exports = WolframQuery;