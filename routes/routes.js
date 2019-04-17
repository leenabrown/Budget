var async = require('async');
var express = require('express');
var app = express();
var Budget = require('../models/budget.js');
var User = require('../models/user.js');

var showBudget = function(req, res) {
    if (req.session.loggedin == 1) {
        var month = req.query.month;
        var year = req.query.year;
        Budget.findOne({username: req.session.user, month: month, year: year}, function (err, result) {
            if (err) {
                console.log(err); 
                res.redirect('/home');
            } else if (!result) {
                res.render('nobudget.ejs');
            }
            else {
                req.session.month = month;
                req.session.year = year;
                req.session.save();
                result.incomeBtn = '';
                result.givingBtn = '';
                result.savingsBtn = '';
                result.housingBtn = '';
                result.transportationBtn = '';
                result.lifestyleBtn = '';
                result.insuranceBtn = '';
                result.taxBtn = '';
                result.debtBtn = '';
                res.render('displaybudget.ejs', result);
            }
        })
    } else {
        res.redirect('/');
    }
}

var signup = function (req, res) {
    res.render('signup.ejs', {message: ''});
}

var postAddItem = function (req, res) {
    if (req.body.submit === 'cancel') {
        var month = req.session.month;
        var year =  req.session.year;
        res.redirect('/showbudget?month=' + month + '&year=' + year);
    } else {
        Budget.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, result) {
            if (err) {
                console.log(err); 
                res.redirect('/home');
            } 
            else {
                var addType = req.session.addType;
                if (addType === 'income') {
                    var copy = result.income.slice();
                    copy.push({label: req.body.labelIncome, amount: req.body.amountIncome});
                    result.income = copy;
                } else if (addType === 'giving') {
                    var copy = result.giving.slice();
                    copy.push({label: req.body.labelGiving, amount: req.body.amountGiving});
                    result.giving = copy;                   
                } else if (addType === 'savings') {
                    var copy = result.savings.slice();
                    copy.push({label: req.body.labelSavings, amount: req.body.amountSavings});
                    result.savings = copy;                     
                } else if (addType === 'housing') {
                    var copy = result.housing.slice();
                    copy.push({label: req.body.labelHousing, amount: req.body.amountHousing});
                    result.housing = copy;                     
                } else if (addType === 'transportation') {
                    var copy = result.transportation.slice();
                    copy.push({label: req.body.labelTransportation, amount: req.body.amountTransportation});
                    result.transportation = copy;                     
                } else if (addType === 'lifestyle') {
                    var copy = result.lifestyle.slice();
                    copy.push({label: req.body.labelLifestyle, amount: req.body.amountLifestyle});
                    result.lifestyle = copy;                     
                } else if (addType === 'insurance') {
                    var copy = result.insurance.slice();
                    copy.push({label: req.body.labelInsurance, amount: req.body.amountInsurance});
                    result.insurance = copy;                     
                } else if (addType === 'tax') {
                    var copy = result.tax.slice();
                    copy.push({label: req.body.labelTax, amount: req.body.amountTax});
                    result.tax = copy;                     
                } else if (addType === 'debt') {
                    var copy = result.debt.slice();
                    copy.push({label: req.body.labelDebt, amount: req.body.amountDebt});
                    result.debt = copy;                     
                }
                    result.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect('/showbudget?month=' + req.session.month + '&year=' + req.session.year);
                    });
                }
        });
    }
}

var postCreateBudget  = function (req, res) {
    var username = req.session.user;
    var month = req.body.month;
    var year = req.body.year;
    var labelIncome = req.body.labelIncome;
    var amountIncome = req.body.amountIncome;
    var labelGiving = req.body.labelGiving;
    var amountGiving = req.body.amountGiving;
    var labelSavings = req.body.labelSavings;
    var amountSavings = req.body.amountSavings;
    var labelHousing = req.body.labelHousing;
    var amountHousing = req.body.amountHousing;
    var labelTransportation = req.body.labelTransportation;
    var amountTransportation = req.body.amountTransportation;
    var labelLifestyle = req.body.labelLifestyle;
    var amountLifestyle = req.body.amountLifestyle;

    var labelInsurance = req.body.labelInsurance;
    var amountInsurance = req.body.amountInsurance; 
    var labelTax = req.body.labelTax;
    var amountTax = req.body.amountTax; 
    var labelDebt = req.body.labelDebt;
    var amountDebt = req.body.amountDebt;   

    Budget.findOne({month: month, year: year}, function (err, b) {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (!b) {
            var budget = new Budget ({
                username: username,
                month : month,
                year : year, 
                income: budgetArr(labelIncome, amountIncome),
                giving: budgetArr(labelGiving, amountGiving),
                savings: budgetArr(labelSavings, amountSavings),
                housing: budgetArr(labelHousing, amountHousing),
                transportation: budgetArr(labelTransportation, amountTransportation),
                lifestyle: budgetArr(labelLifestyle, amountLifestyle),
                insurance: budgetArr(labelInsurance, amountInsurance),
                tax: budgetArr(labelTax, amountTax),
                debt: budgetArr(labelDebt, amountDebt)

            });

            budget.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/home');
                }
            })
        } else {
            b.income = budgetArr(labelIncome, amountIncome);
            b.giving = budgetArr(labelGiving, amountGiving);
            b.savings = budgetArr(labelSavings, amountSavings);
            b.housing = budgetArr(labelHousing, amountHousing);
            b.transportation = budgetArr(labelTransportation, amountTransportation);
            b.lifestyle = budgetArr(labelLifestyle, amountLifestyle);
            b.insurance = budgetArr(labelInsurance, amountInsurance);
            b.tax = budgetArr(labelTax, amountTax);
            b.debt = budgetArr(labelDebt, amountDebt);  
            b.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/home');
                }
            })                    
        }
    })

}

var postEditBudget = function (req, res) {
    Budget.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, result) {
        if (err) {
            console.log(err); 
            res.redirect('/home');
        } 
        else {
            var btnType = req.body.addItemBtn;
            result.incomeBtn = '';
            result.givingBtn = '';
            result.savingsBtn = '';
            result.housingBtn = '';
            result.transportationBtn = '';
            result.lifestyleBtn = '';
            result.insuranceBtn = '';
            result.taxBtn = '';
            result.debtBtn = '';
            if(btnType === 'income') {
                result.incomeBtn = true;
                req.session.addType = 'income';
                req.session.save();
            } else if (btnType === 'giving') {
                result.givingBtn = true;
                req.session.addType = 'giving';
                req.session.save();
            } else if (btnType === 'savings') {
                result.savingsBtn = true;
                req.session.addType = 'savings';
                req.session.save();
            } else if (btnType === 'housing') {
                result.housingBtn = true;
                req.session.addType = 'housing';
                req.session.save();
            } else if (btnType === 'transportation') {
                result.transportationBtn = true;
                req.session.addType = 'transportation';
            } else if (btnType === 'lifestyle') {
                result.lifestyleBtn = true;
                req.session.addType = 'lifestyle';
            } else if (btnType === 'insurance') {
                result.insuranceBtn = true;
                req.session.addType = 'insurance';
            } else if (btnType === 'tax') {
                result.taxBtn = true;
                req.session.addType = 'tax';
            } else if (btnType === 'debt') {
                result.debtBtn = true;
                req.session.addType = 'debt';
            }
            res.render('displaybudget.ejs', result);
        }
    });
    // if (req.body.addItemBtn === 'income') {
    //     res.render('displaybudget', {incomeBtn: true});
    // }
}

var postShowBudget = function (req, res) {

}

var postSignup = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username: username}, function (err, results) {
        if (err) {
            res.send(err);
        } else if (!results) {
            var user = new User({
                username: username,
                password: password
            });
            user.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    req.session.loggedin = 1;
                    req.session.user = username;
                    req.session.message = "";
                    req.session.save();
                    res.redirect('/home');                    
                }
            });

        } else {
            res.render('signup.ejs',{message:"Username already exists."})
        }
    });
}

var budgetArr = function (label, amount) {
    var output = [];
    if (typeof(label) === 'string' && label) {
        output.push({label: label, amount: amount});
    } else {
        for (var i = 0; i < label.length; i++) {
            if(label[i]) {
                output.push({label: label[i], amount: amount[i]});
            }
        }
    }
    return output;
}



var routes = {
    show_budget: showBudget,
    post_add_item: postAddItem,
    post_create_budget : postCreateBudget,
    post_edit_budget: postEditBudget,
    post_show_budget: postShowBudget,
    signup: signup,
    post_signup: postSignup
};

module.exports = routes;



