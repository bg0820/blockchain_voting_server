const pool = require('../../index');

module.exports = {
	createUser: async function(id, phoneNumber, phoneIMEI, walletAddress) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'INSERT INTO user (id, phoneNumber, phoneIMEI, walletAddress, regTime) values (?, ?, ?, ?, CURRENT_TIMESTAMP)';
				
			let result = await pool.queryParam(con, query, [id, phoneNumber, phoneIMEI, walletAddress]);
			con.release();
			
			return result;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	},
	enrollPhoneNumber: async function(phoneNumber, authKey) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			const query = 'INSERT INTO phone (phoneNumber, auth, expire) values (?, ?, ?)';
				
			let expireDate = Date.now() + (300 * 1000);
			let result = await pool.queryParam(con, query, [phoneNumber, authKey, new Date(expireDate)]);
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
			let curDate = Date.now();
			const query = 'SELECT EXISTS (SELECT phoneNumber FROM phone where phoneNumber = ? and auth = ? and expire > ?) as isCheck';
				
			let result = await pool.queryParam(con, query, [phoneNumber, authKey, new Date(curDate)]);
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
	deleteAuth: async function(phoneNumber, authKey) {
		let con;
		try {
			con = await pool.getConnection();
		} catch(err) {
			throw err;
		}

		try {
			let expireDate = Date.now() + (300 * 1000);

			const allDelete = 'DELETE FROM phone WHERE expire < ?';
			const authDelete = 'DELETE FROM phone WHERE phoneNumber = ? and auth = ?';
			
			await pool.queryParam(con, allDelete, [new Date(expireDate)]);
			await pool.queryParam(con, authDelete, [phoneNumber, authKey]);
			con.release();

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
			let expireDate = Date.now() + (300 * 1000);
			const query = 'UPDATE phone SET auth = ?, expire = ? WHERE phoneNumber = ?';
				
			let result = await pool.queryParam(con, query, [authKey, new Date(expireDate), phoneNumber]);
			con.release();

			return true;
		} catch(err) {
			console.log('DB Conn Error', err);
			con.release();
			throw err;
		}
	}
}