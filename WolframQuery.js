const QUERY_START = "SetPrecision[{";
const QUERY_END = "}, 14]";

class WolframQuery {
	constructor(lines) {
		this.lines = lines;
		this.queries = [];
		this.queryPOS = 0;
	}

	buildQueries() {
		for (let j = 0; j < 10; j++) {
			this.query = QUERY_START;
			for (let i = 0; i < 3; i++) {
				this.buildIntegrateQuery(this.lines[this.queryPOS]);
				this.query += ",";
				this.queryPOS++;
			}
			this.query = this.query.substring(0, this.query.length - 1);
			this.query += QUERY_END;
			this.queries.push(this.query);
		}
		return this.queries;
	}

	buildIntegrateQuery(line) {
		let subQuery = "(integrate ";
		subQuery += line.functionExpression + ", ";
		subQuery += "x=" + line.interval[0].trim() + "," + line.interval[1].trim();
		subQuery += ")";
		this.query += subQuery;
	}
}

module.exports = WolframQuery;