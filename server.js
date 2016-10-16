var web = require('express');

var app = web();
var port = process.env.PORT || 3000;
var todos = [{
    id: 1,
    descreption: "do mesha job"
}, {
    id: 2,
    descreption: "do nada job"
}, {
    id: 3,
    descreption: "to mamon job"
}];

app.get('/', function(input, output) {
    output.send('the app is runing !!!');
});

app.listen(port, function() {
    console.log('app runing in port ' + port);

});