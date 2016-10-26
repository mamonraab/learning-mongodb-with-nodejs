var MongoClient = require('mongodb').MongoClient;




 function connectd(url){
  console.log('n  dfdf 0 ');

return new Promise(function (fulfill , reject){
  console.log('n  dfdf 0000 ');

  MongoClient.connect(url , function(err , db){
    console.log('n  dfdf 11 ');

    if (err){
      console.log('n  dfdf ');
      reject('unable to connact to db check '+ err);
    } else {
      console.log('n  dfdf 2 ');

      fulfill(db);
    }
  });

  console.log('n  dfdf 0 1');

});
};
module.exports = {
getdb : function(url){
  if (state.db){
    console.log('db already conected ');

    return state.db;
  } else {
    connectd(url).then(function(res){
      state.db = res;
      console.log('db conacted ');

      return state.db;
    },function(err){
      console.log('db error ');

      return false;
    });
  }
}
,

closed : function (db){
db.close();
db = null;
console.log('db closed ');
}
};
