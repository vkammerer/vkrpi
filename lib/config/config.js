var _ = require('underscore');

module.exports = _.extend(
	require(__dirname + '/env/all.js'),
	require(__dirname + '/env/' + process.env.NODE_ENV + '.json') || {}
);
