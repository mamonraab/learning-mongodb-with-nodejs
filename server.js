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
    var body = _.pick(reqst.body, 'descrption', 'complated');

    if (!_.isBoolean(body.complated) || !_.isString(body.descrption) || body.descrption.trim().length == 0) {

        return respnd.sendStatus(404);
    }

    body.id = todoNextId++;
    body.descrption = body.descrption.trim();
    todos.push(body);
    console.log('description');
    respnd.json(body);
});


app.get('/', function(input, output) {
    output.send('the app is runing !!!');
});
app.get('/todos', function(inpt, out) {
    var flitered = todos;
    var qury = inpt.query;
    if (qury.hasOwnProperty('complated') && qury.complated === 'true') {

        flitered = _.where(flitered, { complated: true });
    }
    if (qury.hasOwnProperty('complated') && qury.complated === 'false') {

        flitered = _.where(flitered, { complated: false });

    }
    if (qury.hasOwnProperty('q')) {


        flitered = _.filter(flitered, function(item) {
            return item.descrption.toLowerCase().indexOf(qury.q) > -1;
        });


    }
    out.json(flitered);
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

//delete request
app.delete('/todos/:id', function(req, res) {
    var toid = parseInt(req.params.id, 10);
    var item = _.findWhere(todos, { id: toid });
    if (!item) {
        return res.status(404).json({ 'error': "item not found" });
    } else {
        todos = _.without(todos, item);
        res.json(item);
    }
});
// put requist for updating  item
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoId });

    var body = _.pick(req.body, 'descrption', 'complated');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

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

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

app.listen(port, function() {
    console.log('app runing in port ' + port);
});