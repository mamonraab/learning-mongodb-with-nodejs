var web = require('express');
var bodyParser = require('body-parser');
//geting the medileware that parse the post
var app = web();
var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
//use the meddileware bodyparser
app.use(bodyParser.json());
//working with post request
app.post('/todos', function(reqst, respnd) {
    var body = reqst.body;
    body.id = todoNextId++;
    todos.push(body);
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

    var id = parseInt(inpt.params.id, 10);

    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            var x = i;
        }
    }
    if (typeof x === 'undefined') {
        out.sendStatus(404);

    } else {
        out.json(todos[x]);
    }
});
app.listen(port, function() {
    console.log('app runing in port ' + port);
});