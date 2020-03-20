const {Schema, model, Types} = require('mongoose')


const schema = new Schema({
	date: {type: Date},
	service: {type: Types.ObjectId, ref: 'Service'},
	count: {type: Number},
	income: {type: Number},
	owner: {type: Types.ObjectId, ref: 'User'}
})


module.exports = model('History', schema)