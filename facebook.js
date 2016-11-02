var web = require('express');
var validator = require('validator');
const formidable = require('express-formidable');
//using underscore labrry
var _ = require('underscore');
var app = web();
var port = process.env.PORT || 3000;
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/r32', ext : '.ect' });
var request = require("request");
app.use(formidable());//working with post request
/*
req.fields; // contains non-file fields
 req.files; // contains files
*/
app.use(web.static('r32'));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

app.get('/view', function (req, res){
    res.render('index');
});
app.get('/fb', function(input, output) {
output.header("Content-Type", "application/json; charset=utf-8");
var url = "https://graph.facebook.com/v2.8/202409816773047?fields=feed.limit(10)%7Bfull_picture%2Cmessage%2Ccreated_time%7D&access_token=EAAKjrMtqCRwBADDc6J4DI6zk8UI649p7cimeRNNEVqZBLQ3Xnsx8Vocrs9Lu3FzhyO992Kz4iRljzu7o3seti16RLS43TLdXQyUJ0FpPBZAUPUJDNKPonfdZC5GGW8CvKCAIVV5SzhoksewpbjuNmIFiCzGeS8Se49z1BxxBQZDZD"
request(url, function(error, response, body) {
var jsonObject = JSON.parse(body);
  output.json(jsonObject.feed.data[0]);
});
});



app.get('/onepage', function(req, res) {

   
   
   
    res.sendFile('r32/OnePage/index.html', {root: __dirname });
 
});



    app.listen(port, function() {
        console.log('app runing in port ' + port);
    });


