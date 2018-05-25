const QUERY_START = "SetPrecision[{";
const QUERY_END = "}, 14]";

class WolframQuery {
	constructor(lines) {
		this.lines = lines;
		this.queries = [];
	}

	buildQueries() {
		for (let j = 0; j < 30; j++) {
			this.query = QUERY_START;
			for (let i = 0; i < 30; i++) {
				this.buildIntegrateQuery(this.lines[i]);
				this.query += ",";
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