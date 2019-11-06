const pool = require('../../index');

module.exports = {
	getCandidateGroupToWalletAddress: async function(walletAddress) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT * FROM blockchain_vote.candidate_group where walletAddress = ?';
				
			let result = await pool.queryParam(con, query, [walletAddress]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	getCandidateGroup: async function(voteIdx) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = "SELECT * FROM blockchain_vote.candidate_group where voteIdx = ?";
	
			let result = await pool.queryParam(con, query, [voteIdx]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	getCandidateGroupWallet: async function(candidateGroupIdx) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT * FROM blockchain_vote.candidate_group where candidateGroupIdx = ?';
				
			let result = await pool.queryParam(con, query, [candidateGroupIdx]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
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
	getCandidates: async function(candidateGroupIdx) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT * FROM candidate where candidateGroupIdx = ? order by position';
				
			let result = await pool.queryParam(con, query, [candidateGroupIdx]);
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