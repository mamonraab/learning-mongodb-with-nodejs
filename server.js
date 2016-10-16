var web = require('express');

var app = web();
var port = process.env.PORT || 3000;
var todos = [{
    id: 1,
    descreption: "do mesha job",
    complated: false
}, {
    id: 2,
    descreption: "do nada job",
    complated: false

}, {
    id: 3,
    descreption: "to mamon job",
    complated: true

}];

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