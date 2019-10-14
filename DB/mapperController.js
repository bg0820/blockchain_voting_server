
const authMapper = require('./Mapper/Auth');


module.exports = function() {
	return {
		auth: authMapper
	}
}();
