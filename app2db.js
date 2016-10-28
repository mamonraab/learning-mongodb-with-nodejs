var express = require('express');
var app = express();
var tododb = require('./db2');
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var bodyParser = require('body-parser'); //geting the medileware that parse the post
var port = process.env.PORT || 3000;

//using underscore labrry
var _ = require('underscore');
var url = 'mongodb://localhost:27017/tododb';
var data = {
    name: {
        fname: 'mamon',
        mname: 'rasool',
        lname: 'abdali'
    },
    age: 31,
    grid: {
        math: 90,
        arabic: 98
    }
};

var data2 = {
    name: {
        fname: 'mamon',
        mname: 'rasool',
        lname: 'abdali'
    },
    age: 31,
    grid: {
        math: 90,
        arabic: 98
    }
};

tododb.connectd(url).then(function(dbcon) {


    app.get('/todo/:id', function(req, res) {

        var id = req.params.id;

        tododb.getById(id, function(err, data) {
            if (err) {
                console.log(err);
                return res(err);
            } else {
                console.log(data);
                return res.json(data);
            }
        }, dbcon);



        /*
          router.get('/userlist', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({},{},function(e,docs){
                res.render('userlist', {
                    "userlist" : docs
                });
            });
        });
        */
    });


    app.listen(port, function() {
        console.log('app runing in port ' + port);
    });



}, function(error) {

    console.log('Unable to connect to Mongo.');
    process.exit(1);
});