var http = require('http')
var sanitize = require('sanitize-caja')
var url = require('url')
var connect = require('connect')
var mongo = require('mongodb')
var mongoose = require("mongoose")

var server = http.createServer(function (req, res) {
  var usedURL = url.parse(req.url).pathname;
//Sanitize URL (this will touch the DB and we want to ensure nothing extra gets in)
  if (usedURL.substring(0,5) == "/new/") {
      var sanitizedURL = sanitize(usedURL.substring(5))
      var checkedURL = checkURL(sanitizedURL)
//This Section Works
        if (checkedURL == "Please input valid URL"){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({"error": checkedURL}));
            res.end();
            return
          }
//URL entered -- verifyed then add dataset 2MB max size for DB
      mongo.connect(process.env.MONGOLAB_URI,function(err,db){
//get number of records & add to DB
      var currentRecord = db.collection('urlstorage').count(function(err, docs){
      db.collection('urlstorage').insert({short: docs+1, long:checkedURL})
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({"short": "https://arcane-gorge-62849.herokuapp.com/" + (docs+1),"long": checkedURL}));
      res.end();
    db.close();
  return});
      });



  } else {
      mongo.connect(process.env.MONGOLAB_URI,function(err,db){
      usedURL = parseInt(usedURL.substring(1));
      db.collection('urlstorage').find({"short": usedURL}).toArray(function(err, results){
  if (results.length > 0)
{
  res.writeHead(301, {'Location': results[0].long});
  res.end();
  db.close();
  return
} else
  {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({"url": "Invalid short URL"}));
    res.end();
    db.close();
    return
  }

})


      }) //find if a value exists
    }})


server.listen(process.env.PORT || 8888);


function checkURL(testURL) {
  var testCase = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!testCase .test(testURL)) {
    return "Please input valid URL";
  } else {
    return testURL;
  }
}
