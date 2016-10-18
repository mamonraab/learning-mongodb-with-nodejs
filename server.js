var web = require('express');
var bodyParser = require('body-parser'); //geting the medileware that parse the post

//using underscore labrry
var _ = require('underscore');

var app = web();
var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
//use the meddileware bodyparser
app.use(bodyParser.json());
//working with post request
app.post('/todos', function(reqst, respnd) {
    var body = reqst.body;

    if (!_.isBoolean(body.complated) || !_.isString(body.descrption) || body.descrption.trim().length == 0) {

        return respnd.sendStatus(404);
    }

    body.id = todoNextId++;
    var x = {
        id: body.id,
        descrption: body.descrption,
        complated: body.complated
    };
    todos.push(x);
    console.log('description');
    respnd.json(body);
});


app.get('/', function(input, output) {
    output.send('the app is runing !!!');
});
app.get('/todos', function(inpt, out) {
    out.json(todos);
});
//get method and geting the var id
app.get("/todos/:id", function(inpt, out) {
    /*
                   If the radix parameter is omitted, JavaScript assumes the following:

                   If the string begins with "0x", the radix is 16 (hexadecimal)
                   If the string begins with "0", the radix is 8 (octal). This feature is deprecated
                   If the string begins with any other value, the radix is 10 (decimal)
    */

    var toid = parseInt(inpt.params.id, 10);

    var x = _.findWhere(todos, { id: toid });

    /*
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
                var x = i;
            }
        }
      */
    if (!x) {
        out.sendStatus(404);

    } else {
        out.json(x);
    }
});
app.listen(port, function() {
    console.log('app runing in port ' + port);
});