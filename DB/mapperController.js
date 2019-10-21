
const authMapper = require('./Mapper/Auth');
const voteMapper = require('./Mapper/Vote');
const candidateMapper = require('./Mapper/Candidate');

module.exports = function() {
	return {
		auth: authMapper,
		vote: voteMapper,
		candidate: candidateMapper
	}
}();
