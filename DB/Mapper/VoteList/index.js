const pool = require('../../index');

module.exports = {
	
	voteList: async function() {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT * FROM vote';
				
			let result = await pool.query(con, query);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	getVote: async function(voteIdx) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT * FROM vote where voteIdx = ?';
				
			let result = await pool.queryParam(con, query,[voteIdx]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	}
}