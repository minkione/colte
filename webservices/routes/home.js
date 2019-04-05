var express = require('express');
var router = express.Router();
var customer = require('../models/customer');
var app = require('../app');
var exec = require('child_process').exec;

router.get('/', function(req, res, next) {
  res.render('home', {
    translate: app.translate,
    title: app.translate("Home"),
  });
});

router.post('/checkStatus', function(req, res, next) {
  var service = req.body.service;
  var returnString = "";
  console.log("Request Service: " + JSON.stringify(service));
  exec("sudo systemctl is-enabled " + service, (function(err, out, stderr) {
    if (err) {
      console.log("Error on is-enabled call: " + err);
      res.status(500);
      res.send("Something went wrong checking the webservices!")
    }
    if (out == "0") {
      console.log("checkStatus: enabled");
      returnString = "enabled";
    } else {
      console.log("checkStatus: disabled");
      returnString = "disabled";
    }
    console.log("Response: " + out);  
  }) () );
  res.status(200);
  res.send(returnString);
});

router.post('/updateStatus', function(req, res, next) {
  var service = req.body.service;
  var checked = req.body.checked;
  console.log("Request Service: " + JSON.stringify(service));
  console.log("Request Checked: " + JSON.stringify(checked));
  if (checked == "true") {
    console.log("Enabling Service");
    exec("sudo systemctl enable " + service, function(err, out, stderr) {
      if (err) {
        console.log("Error on enable call: " + err);
        res.status(500);
        res.send("Something went wrong checking the webservices!")
      }
      console.log("Response: " + out); 
    });
  } else {
    console.log("Disabling Service");
    exec("sudo systemctl disable " + service, function(err, out, stderr) {
      if (err) {
        console.log("Error on enable call: " + err);
        res.status(500);
        res.send("Something went wrong checking the webservices!")
      }
      console.log("Response: " + out); 
    });
  }  
  res.status(200);
  res.send();
});

router.post('/transfer', function(req,res) {
  var source = req.body.source;
  var dest = req.body.dest;
  var amount = req.body.amount;

  console.log("TRANSFER source=" + source + " dest=" + dest + " amount=" + amount);
  customer.transfer_balance(source, dest, amount).catch((error) => {
    console.log("Transfer Error: " + error);
  })
  .then(function() {
    res.redirect('/home');
  });
});

router.post('/topup', function(req,res) {
  var imsi = req.body.imsi;
  var amount = req.body.amount;

  if (amount < 0) {
    console.log("NEGATIVE!!!");
  }

  console.log("TOPUP imsi=" + imsi + ", amount =" + amount);
  customer.top_up(imsi, amount).catch((error) => {
    console.log("Transfer Error: " + error);
  })
  .then(function() {
    res.redirect('/home');
  });
});

router.post('/details', function(req, res, next) {
  var imsi = req.body.imsi;

  console.log("DETAILS" + imsi);
  res.redirect('/details/' + imsi);
});

module.exports = router;