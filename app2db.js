var express = require('express');
var app = express();
var tododb = require('./db2');
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/tododb';
var data = {
  name:{
    fname:'mamon',
    mname:'rasool',
    lname:'abdali'
  },
  age:31,
  grid:{
    math:90, arabic:98
  }
};

var data2 = {
  name:{
    fname:'mamon',
    mname:'rasool',
    lname:'abdali'
  },
  age:31,
  grid:{
    math:90, arabic:98
  }
};

tododb.connectd(url).then(function(result) {

         console.log('conacted !!');
         // Create a new ObjectID

         var col = result.collection('insert_many');
         col.insertMany([data, data2], function(err, r) {
           assert.equal(null, err);
           console.log(r.insertedCount);

           assert.equal(2, r.insertedCount);
});

tododb.insertDocument(result , function(x){

console.log(x);
},data);
tododb.insertDocument(result , function(x){

console.log(x);
},data2);
},
function(err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
}
);
