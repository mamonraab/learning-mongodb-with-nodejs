var web = require('express');
var bodyParser = require('body-parser'); //geting the medileware that parse the post
var validator = require('validator');
const formidable = require('express-formidable');
//using underscore labrry
var _ = require('underscore');
var tododb = require('./db');
var app = web();
var port = process.env.PORT || 3000;
var todos = [];
var DB = {};
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/tododb';

//use the meddileware bodyparser
//app.use(bodyParser.json());
app.use(formidable());//working with post request
/*
req.fields; // contains non-file fields
 req.files; // contains files
*/
app.post('/todos', function(reqst, respnd) {
    var body = _.pick(reqst.body, 'descrption', 'complated');

    if (!_.isBoolean(body.complated) || !_.isString(body.descrption) || body.descrption.trim().length == 0) {

        return respnd.sendStatus(404);
    }

    body.descrption = body.descrption.trim();


    tododb.insertDocument(DB,  body , 'restaurants').then(function(ok){
      respnd.send(ok);
    },function(error){

      respnd.send(error);

    });

});


app.get('/', function(input, output) {
    output.send('the app is runing !!!');
});
app.get('/todos', function(inpt, out) {

    var qury = inpt.query;
    var fliter;
    if (qury.hasOwnProperty('complated') && qury.complated === 'true') {

        fliter = { complated: true };
    }
    if (qury.hasOwnProperty('complated') && qury.complated === 'false') {

        fliter = { complated: false };

    }
    if (qury.hasOwnProperty('q')) {


        fliter = {};


    }
    tododb.getAll(fliter, function(err, data) {
        if (err) {
            console.log(err);
            return out.send(err);
        } else {
            return out.json(data);
        }
    }, DB , 'restaurants');
});
//get method and geting the var id
app.get("/todos/:id", function(inpt, out) {
    /*
                   If the radix parameter is omitted, JavaScript assumes the following:

                   If the string begins with "0x", the radix is 16 (hexadecimal)
                   If the string begins with "0", the radix is 8 (octal). This feature is deprecated
                   If the string begins with any other value, the radix is 10 (decimal)
    */
    var id = inpt.params.id;

    tododb.getById(id, function(err, data) {
        if (err) {
            console.log(err);
            return out.send(err);
        } else {
            return out.json(data);
        }
    }, DB , 'restaurants');
    //  var toid = parseInt(inpt.params.id, 10);

    //var x = _.findWhere(todos, { id: toid });

    /*
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
                var x = i;
            }
        }
      */
    /*if (!x) {
        out.sendStatus(404);

    } else {
        out.json(x);
    }
*/

});

//delete request
app.delete('/todos/:id', function(req, res) {

    tododb.del(DB, req.params.id , 'restaurants').then(function(ok) {

        if (ok.n > 0) {
            res.json(ok);

        } else {
            res.status(404).json({ 'error': "item not found" });

        }


    }, function(error) {
        res.status(404).json({ 'error': "item not found" });


    });
    /*  var toid = parseInt(req.params.id, 10);
      var item = _.findWhere(todos, { id: toid });
      if (!item) {
          return res.status(404).json({ 'error': "item not found" });
      } else {
          todos = _.without(todos, item);
          res.json(item);
      }*/
});
// put requist for updating  item
app.put('/todos/:id', function(req, res) {

    var body = _.pick(req.body, 'descrption', 'complated');
    var validAttributes = {};

    if (body.hasOwnProperty('complated') && _.isBoolean(body.complated)) {
        validAttributes.complated = body.complated;
    } else if (body.hasOwnProperty('complated')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('descrption') && _.isString(body.descrption) && body.descrption.trim().length > 0) {
        validAttributes.descrption = body.descrption;
    } else if (body.hasOwnProperty('descrption')) {
        return res.status(400).send();
    }

    tododb.updateId(DB, validAttributes, req.params.id , 'restaurants').then(function(ok) {
        res.json(ok);

        if (ok.n > 0) {
            res.json(ok);

        } else {
            res.status(404).json({ 'error': "item not found" });

        }


    }, function(error) {
        res.status(404).json({ 'error': "item not found" });
    });

});

//app.use('/users', web.static(__dirname + '/www/user'));

app.get('/users', function(req, res) {
    res.sendFile('www/user/index.html', {root: __dirname })
});
app.post('/auth',function (req , res){

  var data = _.pick(req.fields , 'username' , 'password');
  if (validator.isEmail(data.username+'')){
/*
> console.log(new Buffer("Hello World").toString('base64'));
SGVsbG8gV29ybGQ=
> console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
Hello World
*/
var user = new Buffer(data.username).toString('base64');
var fliter = {
  "email":user
};

tododb.getAll(fliter, function(err, results) {
    if (err) {
        console.log(err);
        return res.send(err);
    } else {
      var pass = new Buffer(data.password).toString('base64');

if (results[0].password == pass){
  return res.json(results);
} else {
  return res.send('invalid login data');

}
    }
}, DB , 'users');

} else {
  res.send('invalid login data');
}
});

app.post('/reg' , function(req , res){

  var data = _.pick(req.fields , 'username' , 'password' ,'email');
  if (validator.isEmail(data.email+'')){

    var user = new Buffer(data.email).toString('base64');
    var userName = new Buffer(data.username).toString('base64');
    var password = new Buffer(data.password).toString('base64');

    var fliter = {
      "email":user,
      "name":userName,
      "password":password
    };


    tododb.insertDocument(DB,  fliter , 'users').then(function(ok){
      res.send(ok);
    },function(error){

      res.send(error);

    });


} else {

res.send('erorr invalide email !!!');

}


});
tododb.connectd(url).then(function(dbcon) {
    DB = dbcon;
    app.listen(port, function() {
        console.log('app runing in port ' + port);
    });



}, function(error) {

    console.log('Unable to connect to Mongo.');
    process.exit(1);
});
