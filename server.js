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
require('events').EventEmitter.prototype._maxListeners = 20;
var xssFilters = require('xss-filters');
var request = require("request");
const crypto = require('crypto');
var FacebookTokenStrategy = require('passport-facebook-token');
var session = require('express-session');
var secr = crypto.randomBytes(16);
app.set('trust proxy', 1);
app.use(session({
secret : secr.toString('hex'),
  httpOnly: true,
  sameSite:true,
  resave: false,
   saveUninitialized: true
}));


app.use(new FacebookTokenStrategy({
    clientID: 742912495847708,
    clientSecret: '2eedf7e9cec4256a5bc4f183cb33f678'
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function (error, user) {
      return done(error, user);
    });
  }
));


// init

// start session for an http request - response
// this will define a session property to the request object
//use the meddileware bodyparser
//app.use(bodyParser.json());
app.use(formidable());//working with post request
/*
req.fields; // contains non-file fields
 req.files; // contains files
*/

app.get('/fb2',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user 
    res.send(req.user? 200 : 401);
  }
);
app.get('/fb', function(input, output) {
output.header("Content-Type", "application/json; charset=utf-8");
var url = "https://graph.facebook.com/v2.8/202409816773047?fields=feed.limit(10)%7Bfull_picture%2Cmessage%2Ccreated_time%7D&access_token=EAAKjrMtqCRwBADDc6J4DI6zk8UI649p7cimeRNNEVqZBLQ3Xnsx8Vocrs9Lu3FzhyO992Kz4iRljzu7o3seti16RLS43TLdXQyUJ0FpPBZAUPUJDNKPonfdZC5GGW8CvKCAIVV5SzhoksewpbjuNmIFiCzGeS8Se49z1BxxBQZDZD"
request(url, function(error, response, body) {
var jsonObject = JSON.parse(body);
  output.json(jsonObject.feed.data[0]);
});
});

app.post('/todos', function(reqst, respnd) {
    var body = _.pick(reqst.fields, 'descrption', 'complated');

    if (!_.isBoolean(body.complated) || !_.isString(body.descrption) || body.descrption.trim().length == 0) {

        return respnd.sendStatus(404);
    }

    body.descrption = xssFilters.inHTMLData(body.descrption.trim());


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
    var id = xssFilters.inHTMLData(inpt.params.id);

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

    tododb.del(DB, xssFilters.inHTMLData(req.params.id) , 'restaurants').then(function(ok) {

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

    var body = _.pick(req.fields, 'descrption', 'complated');
    var validAttributes = {};

    if (body.hasOwnProperty('complated') && _.isBoolean(body.complated)) {
        validAttributes.complated = xssFilters.inHTMLData(body.complated);
    } else if (body.hasOwnProperty('complated')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('descrption') && _.isString(body.descrption) && body.descrption.trim().length > 0) {
        validAttributes.descrption = xssFilters.inHTMLData(body.descrption);
    } else if (body.hasOwnProperty('descrption')) {
        return res.status(400).send();
    }

    tododb.updateId(DB, validAttributes, xssFilters.inHTMLData(req.params.id) , 'restaurants').then(function(ok) {
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

  req.session.regenerate(function(err) {
    // will have a new session here
  });

  var sess = req.session;
  if (req.session.loged){
    res.send('you are loged in !!');
  }else {

    console.log(req.session.loged);
    res.sendFile('www/user/index.html', {root: __dirname });
  }
});
app.post('/auth',function (req , res){
  req.session.regenerate(function(err) {
    // will have a new session here
  });

  var sess = req.session;
  var data = _.pick(req.fields , 'username' , 'password');
  if (validator.isEmail(data.username+'')){
/*
> console.log(new Buffer("Hello World").toString('base64'));
SGVsbG8gV29ybGQ=
> console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
Hello World
*/
var user = new Buffer(xssFilters.inHTMLData(data.username)).toString('base64');
var fliter = {
  "email":user
};

tododb.getAll(fliter, function(err, results) {
    if (err) {
        console.log(err);
        return res.send(err);
    } else {

      var pass = xssFilters.inHTMLData(data.password);

      var hash = crypto.createHmac('sha512', results[0].secret)
                         .update(pass)
                         .digest('hex');
if (results[0].password == hash){
  req.session.loged =true;

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

    var user = new Buffer(xssFilters.inHTMLData(data.email.toLowerCase())).toString('base64');
    var userName = new Buffer(xssFilters.inHTMLData(data.username)).toString('base64');
    var password = xssFilters.inHTMLData(data.password);

    var secret = crypto.randomBytes(16);
    secret =secret.toString('hex');
    var hash = crypto.createHmac('sha512', secret)
                       .update(password)
                       .digest('hex');
    console.log(hash);
    var fliter = {
      "email":user,
      "name":userName,
      "password":hash,
    "secret":secret
    };


    tododb.insertDocument(DB,  fliter , 'users').then(function(ok){
      res.send(xssFilters.inHTMLData(data.username));
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
