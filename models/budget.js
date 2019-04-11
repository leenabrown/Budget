var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/budget', {useNewUrlParser: true});

var Schema = mongoose.Schema;

const budgetSchema = new mongoose.Schema({
	month: {type: String},
	year: {type: Number},
	income: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	giving: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	savings: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	housing: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	transportation: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	lifestyle: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	insurance: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	tax: [{label: { type: String, lowercase: true, trim: true }, amount: String}],
	debt: [{label: { type: String, lowercase: true, trim: true }, amount: String}]
});

module.exports = mongoose.model('Budget', budgetSchema);
