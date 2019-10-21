const pool = require('../../index');

module.exports = {
	voteDetail: async function(voteIdx) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			let result = [];

			const candidate_groupQuery = 'SELECT * FROM candidate_group WHERE voteIdx = ?;'
			const candidate_query = 'SELECT * FROM candidate WHERE candidateGroupIdx = ?;'
			
			await con.beginTransaction();
			
			let candidateGroupResult = await pool.queryParam(con, candidate_groupQuery, [voteIdx]);


			for(var i = 0; i < candidateGroupResult.length; i++) {
				let candidateGroup = candidateGroupResult[i];
				let candidateResult = await pool.queryParam(con, candidate_query, [candidateGroup.candidateGroupIdx]);

				let temp = {
					num: candidateGroup.num,
					title: candidateGroup.name,
					commit: candidateGroup.commit,
					candidate: []
				}

				for(var j = 0; j < candidateResult.length; j++) {
					let candidate = candidateResult[j];

					temp.candidate.push({
						candidateIdx: candidate.candidateIdx,
						name: candidate.name,
						id: candidate.id,
						position: candidate.position === 1 ? '정 학생회장' : '부 학생회장',
						departmentName: candidate.departmentName,
						img: candidate.profileImg,
						career: candidate.career
					});
				}

				result.push(temp);
			}

			await con.commit();
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			await con.rollback(); // ROLLBACK
			con.release();
			throw err;
		}
	},
	candidateGroupCreate: async function(voteIdx, num, name, commit, walletAddress) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'INSERT INTO candidate_group (voteIdx, num, name, commit, walletAddress) values (? ,? ,? ,?, ?)';
			let result = await pool.queryParam(con, query, [voteIdx, num, name, commit, walletAddress]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	candidateCreate: async function(candidateGroupIdx, id, name, departmentName, profileImg, career, position) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'INSERT INTO candidate (candidateGroupIdx, id, name, departmentName, profileImg, career, position) values (? ,? ,? ,?, ?, ?, ?)';
			let result = await pool.queryParam(con, query, [candidateGroupIdx, id, name, departmentName, profileImg, career, position]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	voteCreate: async function(name, voteType, startDate, endData) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'INSERT INTO vote (name, voteType, startDate, endDate) values (? ,? ,? ,?)';
			let result = await pool.queryParam(con, query, [name, voteType, startDate, endData]);
			con.release();

			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	voteEndList: async function() {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT * FROM vote WHERE endDate < CURRENT_TIMESTAMP';
				
			let result = await pool.query(con, query);
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
			const query = 'SELECT * FROM vote WHERE startDate <= CURRENT_TIMESTAMP and endDate >= CURRENT_TIMESTAMP';
				
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