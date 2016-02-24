var http = require('http')
var sanitize = require('sanitize-caja')
var url = require('url')
var connect = require('connect')
var mongo = require('mongodb')

var server = http.createServer(function (req, res) {
//Expected input /new/http://www.somewhere.com
//Expected output http://MyAppNameHere.herokuapp.com/0

//get url
var usedURL = url.parse(req.url).pathname;
//Sanitize URL (this will touch the DB and we want to ensure nothing extra gets in)
if (usedURL.substring(0,5) == "/new/") {
var sanitizedURL = sanitize(usedURL.substring(5))
  console.log(sanitizedURL);
var checkedURL = checkURL(sanitizedURL)
console.log(checkedURL)
//URL entered -- verify then add set 2MB max size for DB

//add url to db

}


//parse JSON response

});
server.listen(process.env.PORT || 8888);


function checkURL(testURL) {
  var testCase = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!testCase .test(testURL)) {
    return "Please input valid URL";
  } else {
    return testURL;
  }
}
