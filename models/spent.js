var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/budget', {useNewUrlParser: true});

var Schema = mongoose.Schema;

const spentSchema = new mongoose.Schema({
	username: {type: String}, 
	month: {type: String},
	year: {type: Number},
	giving: [{label: String , amount: String}],
	savings: [{label: String , amount: String}],
	housing: [{label: String , amount: String}],
	transportation: [{label: String , amount: String}],
	food: [{label: String , amount: String}],
	lifestyle: [{label: String , amount: String}],
	insurance: [{label: String , amount: String}],
	debt: [{label: String , amount: String}]
});

module.exports = mongoose.model('Spent', spentSchema);
