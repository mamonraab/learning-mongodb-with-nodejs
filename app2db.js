var express = require('express');
var app = express();
var tododb = require('./db2');



// Connect to Mongo on start
/*
var nosqol = tododb.connectd(url).then(function(result){
console.log('conacted');
  return result;
},
  function(err){
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  }
);

*/
//insert one decumnt its mean one row in the rable called restaurants and  collection is mean table

var insertDocument = function(db, callback) {
    db.collection('restaurants').insertOne({
        "address": {
            "street": "2 Avenue",
            "zipcode": "10075",
            "building": "1480",
            "coord": [-73.9557413, 40.7720266]
        },
        "borough": "Manhattan",
        "cuisine": "Italian",
        "grades": [{
                "date": new Date("2014-10-01T00:00:00Z"),
                "grade": "A",
                "score": 11
            },
            {
                "date": new Date("2014-01-16T00:00:00Z"),
                "grade": "B",
                "score": 17
            }
        ],
        "name": "Vella",
        "restaurant_id": "41704620"
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    });
};

// call function and insert
console.log('inseart data =====================================');
insertDocument(tododb.dbcon, function() {
    //  tododb.close();
});

// call function and insert
console.log('inseart data =====================================');
insertDocument(tododb.dbcon, function() {
    //  tododb.close();
});

// call function and insert
console.log('inseart data =====================================');
insertDocument(tododb.dbcon, function() {
    //  tododb.close();
});

// call function and insert
console.log('inseart data =====================================');
insertDocument(tododb.dbcon, function() {
    //  tododb.close();
});