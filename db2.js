var MongoClient = require('mongodb').MongoClient;

var state = {
  db: null,
};

function connectd(url) {

return new Promise(function (fulfill , reject){
  if (state.db) {
    fulfill(state.db);
  } else {


    MongoClient.connect(url, function(err, db) {
      if (err) {
reject(err);
      } else {
          state.db = db;
          fulfill(state.db);

    }
  });



  }

});

};



exports.getdb  = function (url){
connectd(url).then(function(result){
console.log('conacted');
  return result;
},
  function(err){
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  }
);
};


exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
};
