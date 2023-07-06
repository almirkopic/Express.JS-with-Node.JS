const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
 

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

//calculator.js
app.post("/", function(req, res){

    var num1= Number(req.body.n1);
    var num2 = Number(req.body.n2);

    var result = num1 + num2;

res.send("The result of the calculation is " + result);
});

//BMI Calculator.js
app.get("/bmicalculator", function (request, response) {
    response.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmicalculator", function(req, res){
var weight = parseFloat(req.body.weight);
var height = parseFloat(req.body.height);

var bmi = weight / (height * height);

res.send("Your BMI is " + bmi);

});
