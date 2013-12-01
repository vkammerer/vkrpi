var path = require('path'),
rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 9000,
    db: process.env.MONGOHQ_URL    
}
