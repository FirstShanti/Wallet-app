const userRouters = require('./user/user.js');

module.exports = function(app, db) {
	userRouters(app, db);
};
