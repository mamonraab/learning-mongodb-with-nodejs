var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/tododb';

var dbcon = undefined;

exports.connectd = function(url) {
    console.log(typeof dbcon);
    return new Promise(function(fulfill, reject) {
        if (dbcon) {
            console.log('iam using already exist conaction');
            fulfill(dbcon);
        } else {


            MongoClient.connect(url, function(err, db) {
                if (err) {
                    reject(err);
                } else {
                    console.log('iam opining new  conaction');

                    dbcon = db;
                    fulfill(dbcon);

                }
            });



        }

    });

};



// inster data

exports.insertDocument = function(url, callback , data) {

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.collection('restaurants').insertOne(data, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback("Inserted a document into the restaurants collection.");
    });
    db.close();
  });
};




exports.manyinsert = function(url, callback , data){

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.collection('restaurants').insertMany([data,data ,data ,data ,data], function(err, result) {
        assert.equal(err, null);
        console.log(result.insertedCount);
        callback('Inserted a document into the restaurants collection.' + result.insertedCount);
    });
    db.close();
  });
};






exports.getUsersByCity = function(city, cb ,url) {
  MongoClient.connect(url, function(err, db) {

db.collection('restaurants').find({}).toArray(cb);

});

}
