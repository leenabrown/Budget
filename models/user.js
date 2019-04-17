var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/budget', {useNewUrlParser: true});

var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	username: String, 
	password: String
});

module.exports = mongoose.model('Users', userSchema);