var async = require('async');
var express = require('express');
var app = express();
var Budget = require('../models/budget.js');

var showBudget = function(req, res) {
    console.log(req.query);
    Budget.findOne({month: req.query.month, year: req.query.year}, function (err, result) {
        if (err) {
            console.log(err); 
            res.redirect('/');
        } else if (!result) {
            res.render('nobudget.ejs');
        }
        else {
            res.render('displaybudget.ejs', result);
        }
    })
}

var postCreateBudget  = function (req, res) {
    console.log(typeof(req.body.labelIncome));
    console.log(req.body);
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
                    res.redirect('/');
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
                    res.redirect('/');
                }
            })                    
        }
    })

}

var postShowBudget = function (req, res) {

}

var budgetArr = function (label, amount) {
    var output = [];
    console.log('type of label' + typeof(label));
    console.log('type of amount' + typeof(amount));
    if (typeof(label) === 'string' && label) {
        console.log("true");
        output.push({label: label, amount: amount});
    } else {
        for (var i = 0; i < label.length; i++) {
            if(label[i]) {
                output.push({label: label[i], amount: amount[i]});
            }
        }
    }
    console.log(output);
    return output;
}

var routes = {
    show_budget: showBudget,
    post_create_budget : postCreateBudget,
    post_show_budget: postShowBudget
};

module.exports = routes;



