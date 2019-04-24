var express = require('express');
var routes = require('./routes/routes.js');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Users = require('./models/user.js');

const PORT = 8080;
const HOST = '0.0.0.0';

app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'suchasecuresecret'}));

app.get('/', function (req, res) {
  res.render('login.ejs', {message: ''});
});

app.post('/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  Users.findOne({username: username, password: password}, function (err, results) {
    if (err) {
      res.send(err);
    } else if (results) {
      req.session.loggedin = 1;
      req.session.user = username;
      req.session.message = "";
      req.session.menu = "";
      req.session.save();
      res.redirect('/home');
    } else {
      res.render('login.ejs',{message:'Incorrect login credentials.'})
    }
  });
})

app.get('/home', function (req, res) {
  if(req.session.loggedin == 1) {
    req.session.menu = '';
    res.render('home.ejs');
  } else {
    res.redirect('/');
  }
});


app.get('/createbudget', function (req, res) {
  if (req.session.loggedin == 1) {
    res.render('createbudget.ejs');   
  } else {
    res.redirect('/');
  }
});

app.post('/logout', function (req, res) {
  req.session.loggedin = 0;
  req.session.menu = '';
  req.session.save();
  res.redirect('/');
});

app.post('/createbudget', routes.post_create_budget);
app.post('/editbudget', routes.post_edit_budget);
app.post('/addItem', routes.post_add_item);
app.get('/showbudget', routes.show_budget);
app.post('/showbudget', routes.post_show_budget);
app.get('/signup',routes.signup);
app.post('/signup', routes.post_signup);
app.get('/addexpense', routes.add_expense);
app.post('/addexpense', routes.post_add_expense);
console.log('Starting budget app...');
app.listen(PORT, HOST);
console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');