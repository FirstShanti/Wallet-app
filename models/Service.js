const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
	name: {type: String, required: true},
	price: {type: Number, required: true},
	percent: {type: Number, default: 100},
	income: {type: Number,
    	default: function() {
      		return this.price * this.percent / 100
    	}
  	},
	owner: {type: Types.ObjectId, ref: 'User'}
})


module.exports = model('Service', schema)


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

