const QUERY_START = "SetPercision[{";
const QUERY_END = "}, 14]";

class WolframQuery {
	constructor(lines) {
		this.lines = lines;
	}

	buildQuery() {
		this.query = QUERY_START;
		for (let i = 0; i < this.lines.length; i++) {
			this.buildIntegrateQuery(this.lines[i]);
			if (i < this.lines.length - 1) {
				this.query += ", ";
			}
		}
		this.query += QUERY_END;
		return this.query;
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