var MongoClient = require('mongodb').MongoClient;

var state = {
  db: null,
};

exports.connectd = function(url) {

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


exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
};
