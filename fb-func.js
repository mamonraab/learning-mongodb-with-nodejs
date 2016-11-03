var request = require("request");

exports.fetchfb = function(url){
return new Promise(function (fulfil , reject){

  request(url, function(error, response, body) {
    if (error){
      reject('error geting data');
    } else {
      fulfil(body);
    }

  });

});

}
