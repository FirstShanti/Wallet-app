const {Schema, model, Types} = require('mongoose')
// const sql = require('../db.js');
// const validator = require('../utils/user.js')

const schema = new Schema({
	name: {type: String},
	email: {type: String, requered: true, unique: true},
	password: {type: String, required: true},
	created: {type: Date, default: Date.now},
	services: [{type: Types.ObjectId, ref: 'Service'}],
	history: [{type: Types.ObjectId, ref: 'History'}]
})


module.exports = model('User', schema)


// const User = function(data) {
// 	this.data = data
// };

// User.register = function(data) {
// 	//validator for data before write in db
// 	const validatorResponse = validator.register(data)
// 	if (validatorResponse.errors) return validatorResponse

// 	const {firstname, lastname, email, phone, password} = data;

// 	sql.query('INSERT INTO knots.user set ?', data, function(err, res) {
// 		if (err) {
// 			console.log('error':err);
// 			return { errors: { system: err}};
// 		} else {
// 			console.log(res.insertId);
// 			return {'success':true};
// 		}
// 	});
// }

