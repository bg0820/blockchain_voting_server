const pool = require('../../index');

module.exports = {
	enrollPhoneNumber: async function(phoneNumber, authKey) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'INSERT INTO phone (phoneNumber, auth) values (?, ?)';
				
			let result = await pool.queryParam(con, query, [phoneNumber, authKey]);
			con.release();
			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	authPhone: async function(phoneNumber, authKey) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'SELECT EXISTS (SELECT phoneNumber FROM phone where phoneNumber = ? and auth = ?) as isCheck';
				
			let result = await pool.queryParam(con, query, [phoneNumber, authKey]);
			con.release();

			if(result[0].isCheck == 0)
				return false;

			return true;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	reSend: async function(phoneNumber, authKey) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'UPDATE phone SET auth = ? WHERE phoneNumber = ?';
				
			let result = await pool.queryParam(con, query, [authKey, phoneNumber]);
			con.release();

			return true;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	}
}