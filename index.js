var express = require('express');
var routes = require('./routes/routes.js');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Budget = require('./models/budget.js');

const PORT = 8080;
const HOST = '0.0.0.0';

app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'suchasecuresecret'}));

app.get('/', function (req, res) {
	res.render('home.ejs')
});

app.get('/createbudget', function (req, res) {
	res.render('createbudget.ejs');
})

app.post('/createbudget', routes.post_create_budget);
app.get('/showbudget', routes.show_budget);
app.post('/showbudget', routes.post_show_budget);
console.log('Starting budget app...');
app.listen(PORT, HOST);
console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');