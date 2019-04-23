var async = require('async');
var express = require('express');
var app = express();
var Budget = require('../models/budget.js');
var Spent = require('../models/spent.js');
var User = require('../models/user.js');

var addExpense = function (req, res) {
    console.log(req.session);
    if (req.session.loggedin == 1) {
        Budget.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, b) {
            if (err) {
                console.log(err); 
                res.redirect('/home');
            } else {
                res.render('addexpense.ejs', {giving: b.giving, savings: b.savings, housing: b.housing, 
                    transportation: b.transportation, food: b.food, lifestyle: b.lifestyle, 
                    insurance: b.insurance, debt: b.debt});
            }
        });
    } else {
        res.redirect('/');
    }
}

var postAddExpense = function (req, res) {
    var link  = '/showbudget?month=' + req.session.month + '&year=' + req.session.year;   
    Spent.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, result) {
        if (err) {
            res.redirect('/home');
        } else {
            var itm = req.body.item;
            var amt = parseFloat(req.body.amount);
            var givingTmp = result.giving.slice();
            var savingsTmp = result.savings.slice();
            var housingTmp = result.housing.slice();
            var transportationTmp = result.transportation.slice()
            var foodTmp = result.food.slice();
            var lifestyleTmp = result.lifestyle.slice();
            var insuranceTmp = result.insurance.slice();
            var debtTmp = result.debt.slice();

            result.giving = updateSpent(givingTmp, itm, amt);
            result.savings = updateSpent(savingsTmp, itm, amt);
            result.housing = updateSpent(housingTmp, itm, amt);
            result.transportation = updateSpent(transportationTmp, itm, amt);
            result.food = updateSpent(foodTmp, itm, amt);
            result.lifestyle = updateSpent(lifestyleTmp, itm, amt);
            result.insurance = updateSpent(insuranceTmp, itm, amt);
            result.debt = updateSpent(debtTmp, itm, amt);
            result.save (function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
    res.redirect(link);
}

var updateSpent = function (arr, name, incr) {
    var output = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].label === name) {
                var oldAmt2 = parseFloat(arr[i].amount);
                var newAmt2 = parseFloat(oldAmt2) + parseFloat(incr);
                arr[i].amount = parseFloat(newAmt2).toFixed(2).toString();
                output.push(arr[i]);
            }
            else {
                output.push(arr[i]);
            }                
        }
    return output;
}



var showBudget = function(req, res) {
    console.log(req.body);
    console.log(req.query);
    if (req.session.loggedin == 1) {
        if (req.session.menu === 'planned') {
            console.log("planned");
            console.log(req.session.month);
            console.log(req.session.year);
            Budget.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, result) {
                if (err) {
                    console.log(err); 
                    res.redirect('/home');
                } else if (!result) {
                    res.render('nobudget.ejs');
                }
                else {
                    result.incomeBtn = '';
                    result.givingBtn = '';
                    result.savingsBtn = '';
                    result.housingBtn = '';
                    result.transportationBtn = '';
                    result.foodBtn = '';
                    result.lifestyleBtn = '';
                    result.insuranceBtn = '';
                    result.debtBtn = '';
                    res.render('displaybudget.ejs', result);
                }
            });
        } else if (req.session.menu === 'spent') {
            console.log("spent");;
            Spent.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, result) {
                console.log(result);
                if (err) {
                    console.log(err); 
                    res.redirect('/home');
                } else if (!result) {
                    res.render('nobudget.ejs');
                }
                else {
                    result.type = "Spent";
                    res.render('diffbudget.ejs', result);
                }
            });

        } else if (req.session.menu === 'remaining') {
            console.log("remaining");
            console.log(req.session.month);
            console.log(req.session.year);
            Budget.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, budget) {
                if (err) {
                    console.log(err);
                    res.redirect('/home');
                } else if (!budget) {
                    res.render('nobudget.ejs');
                } else {
                    Spent.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, spent) {
                        if (err) {
                            console.log(err);
                            res.redirect('/home');
                        } else {
                            var result = difference (budget, spent);
                            result.type = "Remaining";
                            result.month = req.session.month;
                            result.year = req.session.year;
                            res.render('diffbudget.ejs', result);
                        }
                    })
                }
            })
        } else {
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
                    result.foodBtn = '';
                    result.lifestyleBtn = '';
                    result.insuranceBtn = '';
                    result.debtBtn = '';
                    res.render('displaybudget.ejs', result);
                }
            });
        }
    } else {
        res.redirect('/');
    }
}

var difference = function (budget, spent) {
    var output = {};
    output.giving = diffArr(budget.giving.slice(), spent.giving.slice());
    output.savings = diffArr(budget.savings.slice(), spent.savings.slice());
    output.housing = diffArr(budget.housing.slice(), spent.housing.slice());
    output.transportation = diffArr(budget.transportation.slice(), spent.transportation.slice());
    output.food = diffArr(budget.food.slice(), spent.food.slice());
    output.lifestyle = diffArr(budget.lifestyle.slice(), spent.lifestyle.slice());
    output.insurance = diffArr(budget.insurance.slice(), spent.insurance.slice());
    output.debt = diffArr(budget.debt.slice(), spent.debt.slice());
    return output;
}

var diffArr = function (bArr, sArr) {
    var diffArr = [];
    for (var i = 0; i < bArr.length; i++) {
        var diff = parseFloat(bArr[i].amount) - parseFloat(sArr[i].amount);
        var currDiff = {label: bArr[i].label, amount: diff.toFixed(2).toString()};
        diffArr.push(currDiff);
    }
    return diffArr;
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
                Spent.findOne({username: req.session.user, month: req.session.month, year: req.session.year}, function (err, spent) {
                    if (!err) {
                        var addType = req.session.addType;
                        if (addType === 'income') {
                            var copy = result.income.slice();
                            copy.push({label: req.body.labelIncome, amount: parseFloat(req.body.amountIncome).toFixed(2).toString()});
                            result.income = copy;
                        } else if (addType === 'giving') {
                            var copy = result.giving.slice();
                            var scopy = result.giving.slice();
                            copy.push({label: req.body.labelGiving, amount: parseFloat(req.body.amountGiving).toFixed(2).toString()});
                            scopy.push({label: req.body.labelGiving, amount: '0.00'});
                            result.giving = copy;    
                            spent.giving = scopy;               
                        } else if (addType === 'savings') {
                            var copy = result.savings.slice();
                            var scopy = result.savings.slice();
                            copy.push({label: req.body.labelSavings, amount: parseFloat(req.body.amountSavings).toFixed(2).toString()});
                            scopy.push({label: req.body.labelSavings, amount: '0..00'});
                            result.savings = copy; 
                            spent.savings = scopy;                     
                        } else if (addType === 'housing') {
                            var copy = result.housing.slice();
                            var scopy = result.housing.slice();
                            copy.push({label: req.body.labelHousing, amount: parseFloat(req.body.amountHousing).toFixed(2).toString()});
                            scopy.push({label: req.body.labelHousing, amount: '0.00'});
                            result.housing = copy; 
                            spent.housing = scopy;                     
                        } else if (addType === 'transportation') {
                            var copy = result.transportation.slice();
                            var scopy = result.transportation.slice();
                            copy.push({label: req.body.labelTransportation, amount: parseFloat(req.body.amountTransportation).toFixed(2).toString()});
                            scopy.push({label: req.body.labelTransportation, amount: '0.00'});
                            result.transportation = copy;  
                            spent.transportation = scopy;                    
                        } else if (addType === 'food') {
                            var copy = result.food.slice();
                            var scopy = result.food.slice();
                            copy.push({label: req.body.labelFood, amount: parseFloat(req.body.amountFood).toFixed(2).toString()});
                            scopy.push({label: req.body.labelFood, amount: '0.00'});
                            result.food = copy; 
                            spent.food = scopy;                     
                        } else if (addType === 'lifestyle') {
                            var copy = result.lifestyle.slice();
                            var scopy = result.lifestyle.slice();
                            copy.push({label: req.body.labelLifestyle, amount: parseFloat(req.body.amountLifestyle).toFixed(2).toString()});
                            scopy.push({label: req.body.labelLifestyle, amount: '0.00'});
                            result.lifestyle = copy;     
                            spent.lifestyle = scopy;                 
                        } else if (addType === 'insurance') {
                            var copy = result.insurance.slice();
                            var scopy = result.insurance.slice();
                            copy.push({label: req.body.labelInsurance, amount: parseFloat(req.body.amountInsurance).toFixed(2).toString()});
                            scopy.push({label: req.body.labelInsurance, amount: '0.00'});
                            result.insurance = copy;  
                            spent.insurance = scopy;                    
                        } else if (addType === 'debt') {
                            var copy = result.debt.slice();
                            var scopy = result.debt.slice();
                            copy.push({label: req.body.labelDebt, amount: parseFloat(req.body.amountDebt).toFixed(2).toString()});
                            scopy.push({label: req.body.labelDebt, amount: '0.00'});
                            result.debt = copy; 
                            spent.debt = scopy;                     
                        }
                        spent.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        result.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect('/showbudget?month=' + req.session.month + '&year=' + req.session.year);
                        });
                    } else {
                        console.log(err);
                        res.redirect('/home');
                    }
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
    var labelFood = req.body.labelFood;
    var amountFood = req.body.amountFood; 
    var labelLifestyle = req.body.labelLifestyle;
    var amountLifestyle = req.body.amountLifestyle;

    var labelInsurance = req.body.labelInsurance;
    var amountInsurance = req.body.amountInsurance; 

    var labelDebt = req.body.labelDebt;
    var amountDebt = req.body.amountDebt;   

    Budget.findOne({username: username, month: month, year: year}, function (err, b) {
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
                food: budgetArr(labelFood, amountFood),                
                lifestyle: budgetArr(labelLifestyle, amountLifestyle),
                insurance: budgetArr(labelInsurance, amountInsurance),
                debt: budgetArr(labelDebt, amountDebt)

            });

            budget.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                }
            });
        } else {
            b.income = budgetArr(labelIncome, amountIncome);
            b.giving = budgetArr(labelGiving, amountGiving);
            b.savings = budgetArr(labelSavings, amountSavings);
            b.housing = budgetArr(labelHousing, amountHousing);
            b.transportation = budgetArr(labelTransportation, amountTransportation);
            b.food = budgetArr(labelFood, amountFood);            
            b.lifestyle = budgetArr(labelLifestyle, amountLifestyle);
            b.insurance = budgetArr(labelInsurance, amountInsurance);
            b.debt = budgetArr(labelDebt, amountDebt);  
            b.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                }
            }) ;                   
        }
    });

    Spent.findOne({username: username, month: month, year: year}, function (err, b) {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (!b) {
            var spent = new Spent ({
                username: username,
                month : month,
                year : year, 
                giving: zeroBudgetArr(labelGiving, amountGiving),
                savings: zeroBudgetArr(labelSavings, amountSavings),
                housing: zeroBudgetArr(labelHousing, amountHousing),
                transportation: zeroBudgetArr(labelTransportation, amountTransportation),
                food: zeroBudgetArr(labelFood, amountFood),                
                lifestyle: zeroBudgetArr(labelLifestyle, amountLifestyle),
                insurance: zeroBudgetArr(labelInsurance, amountInsurance),
                debt: zeroBudgetArr(labelDebt, amountDebt)

            });

            spent.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/home');
                }
            });
        } else {
            b.giving = zeroBudgetArr(labelGiving, amountGiving);
            b.savings = zeroBudgetArr(labelSavings, amountSavings);
            b.housing = zeroBudgetArr(labelHousing, amountHousing);
            b.transportation = zeroBudgetArr(labelTransportation, amountTransportation);
            b.food = zeroBudgetArr(labelFood, amountFood);            
            b.lifestyle = zeroBudgetArr(labelLifestyle, amountLifestyle);
            b.insurance = zeroBudgetArr(labelInsurance, amountInsurance);
            b.debt = zeroBudgetArr(labelDebt, amountDebt);  
            b.save(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/home');
                }
            }) ;                   
        }
    });

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
            result.foodBtn = '';            
            result.lifestyleBtn = '';
            result.insuranceBtn = '';
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
            } else if (btnType === 'food') {
                result.foodBtn = true;
                req.session.addType = 'food';
            } else if (btnType === 'lifestyle') {
                result.lifestyleBtn = true;
                req.session.addType = 'lifestyle';
            } else if (btnType === 'insurance') {
                result.insuranceBtn = true;
                req.session.addType = 'insurance';
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
    console.log('postshow');
    console.log(req.body.menu);
    console.log(req.session);
    if (req.body.menu === 'planned') {
        req.session.menu = 'planned'; 
        req.session.save();
    } else if (req.body.menu === 'spent') {
        req.session.menu = 'spent'; 
        req.session.save();
    } else if (req.body.menu === 'remaining') {
        req.session.menu = 'remaining'; 
        req.session.save();
    }
    var link  = '/showbudget?month=' + req.session.month + '&year=' + req.session.year;  
    console.log(link); 
    res.redirect(link);
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
        output.push({label: label, amount: parseFloat(amount).toFixed(2).toString()});
    } else {
        for (var i = 0; i < label.length; i++) {
            if(label[i]) {
                output.push({label: label[i], amount: parseFloat(amount[i]).toFixed(2).toString()});
            }
        }
    }
    return output;
}

var zeroBudgetArr = function (label, amount) {
    var output = [];
    if (typeof(label) === 'string' && label) {
        output.push({label: label, amount: '0.00'});
    } else {
        for (var i = 0; i < label.length; i++) {
            if(label[i]) {
                output.push({label: label[i], amount: '0.00'});
            }
        }
    }
    return output;
}



var routes = {
    add_expense: addExpense,
    show_budget: showBudget,
    post_add_item: postAddItem,
    post_add_expense: postAddExpense,
    post_create_budget : postCreateBudget,
    post_edit_budget: postEditBudget,
    post_show_budget: postShowBudget,
    signup: signup,
    post_signup: postSignup
};

module.exports = routes;



