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
    out.send('these is id of ' + inpt.params.id);
});
app.listen(port, function() {
    console.log('app runing in port ' + port);

});