var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/tododb';

var dbcon = undefined;

function connectd(url) {
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

connectd(url).then(function(result) {
        module.exports = dbcon;
        console.log('conacted !!');
    },
    function(err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    }
);