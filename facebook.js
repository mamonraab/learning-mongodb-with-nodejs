var web = require('express');
var bodyParser = require('body-parser'); //geting the medileware that parse the post
var validator = require('validator');
const formidable = require('express-formidable');
//using underscore labrry
var _ = require('underscore');
var app = web();
var port = process.env.PORT || 3000;
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/r32', ext : '.ect' });
var request = require("request");
var path = require('path');
app.use(web.static(path.join(__dirname, 'r32')));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

process.setMaxListeners(0);
app.use(formidable());//working with post request
/*
req.fields; // contains non-file fields
 req.files; // contains files
*/

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);


app.get('/fb', function(input, output) {
output.header("Content-Type", "application/json; charset=utf-8");
var url = "https://graph.facebook.com/v2.8/202409816773047?fields=feed.limit(10)%7Bfull_picture%2Cmessage%2Ccreated_time%7D&access_token=742912495847708|R7_vOrPKm34iLPAn7-eKq5sWBNc";
request(url, function(error, response, body) {
var jsonObject = JSON.parse(body);
 output.json(jsonObject.feed);

});
});

app.get('/fb2', function(input, output) {
//output.header("Content-Type", "application/json; charset=utf-8");

var url = "https://graph.facebook.com/v2.8/202409816773047?fields=feed.limit(10)%7Bfull_picture%2Cmessage%2Ccreated_time%7D&access_token=742912495847708|R7_vOrPKm34iLPAn7-eKq5sWBNc";
request(url, function(error, response, body) {
var jsonObject = JSON.parse(body);

    output.render('index',jsonObject.feed);
});


});

app.get('/onepage', function(req, res) {

   
   
   
    res.sendFile('r32/OnePage2/index.html', {root: __dirname });
 
});



    app.listen(port, function() {
        console.log('app runing in port ' + port);
    });


