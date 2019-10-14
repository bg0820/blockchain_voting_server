const dbConfig = require('./config.js');
const mysql = require('mysql');

let pool;

module.exports = {
	init: function() {
		pool = mysql.createPool(dbConfig);

		console.log('Mysql Initialize...');
	},

	getConnection: function() {
		return new Promise(async function(resolve, reject) {
			pool.getConnection(function(err, con) {
				if(err)
					reject(err);
				
				resolve(con);
			});
		})
		
	},

	query: function(con, query) {
		return new Promise(async function(resolve, reject) {
			con.query(query, function(err, rows) {
				if(err)
					reject(err);

				resolve(rows);
			});
		});
	},

	queryParam: function(con, query, param) {
		return new Promise(async function(resolve, reject) {
			con.query(query, param, function(err, rows) {
				if(err)
					reject(err);

				resolve(rows);
			});
		});
	},

	end: function(callback) {
		pool.end(callback);
	}
};
