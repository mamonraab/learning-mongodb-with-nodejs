var express = require('express');
var app = express();
var tododb = require('./db2');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/tododb';

// Connect to Mongo on start

var nosqol = tododb.connectd(url).then(function(result){
console.log('conacted');
  return result;
},
  function(err){
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  }
);


console.log(nosqol);
