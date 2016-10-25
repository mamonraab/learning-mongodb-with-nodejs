// geting monogodb libriry
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//neded for insertion and finde
var ObjectId = require('mongodb').ObjectID;

//make connaction string
var url = 'mongodb://localhost:27017/test';

//make connaction

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('connection secceesfully');
    db.close();

});

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
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('inseart data =====================================');

    insertDocument(db, function() {
        db.close();
    });
});


// get all collection (table)  decumnt (rows)

var findRestaurants = function(db, callback) {
    var cursor = db.collection('restaurants').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};



//Call the findRestaurants function.

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('get all collection data =====================================');

    findRestaurants(db, function() {
        db.close();
    });
});


//search for spicif top level field

var searchRestaurants = function(db, callback) {
    var cursor = db.collection('restaurants').find({ "borough": "Manhattan" });
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};



//Call the searchRestaurants function.
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('searching=====================================');

    searchRestaurants(db, function() {

        db.close();
    });
});



//search tow level

var leve2FindRestaurants = function(db, callback) {
    var cursor = db.collection('restaurants').find({ "address.zipcode": "10075" });
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};



MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('===============================================');
    console.log('===============================================');
    console.log('============= two leve search =================');
    console.log('===============================================');
    console.log('===============================================');
    console.log('===============================================');
    leve2FindRestaurants(db, function() {
        db.close();
    });
});

//Specify Conditions with Operators
//Greater Than Operator ($gt)
//full list of opreter  https://docs.mongodb.com/manual/reference/operator/query/
var findOpreterRestaurants = function(db, callback) {
    var cursor = db.collection('restaurants').find({ "grades.score": { $gt: 30 } });
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};


MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    findOpreterRestaurants(db, function() {
        db.close();
    });
});


//Combine Conditions