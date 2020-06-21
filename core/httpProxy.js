const { URL } = require("url");
const http = require("http");
const https = require("https");
const getRealUrl = require("../lib/io").getRealUrl;

var application = require("./application");
//var request = require('sync-request');

function ajax(
  //mapping,
  rootPath,
  paths,
  method,
  urlString,
  parameters,
  cookies,
  callback,
  error
) {
  //rootPath = 'http://localhost:8181/';
  if (method == null) method = "GET";
  method = method.toUpperCase();
  urlString = getRealUrl(rootPath, paths, urlString);
  var mapping = application.data.mapping;
  if (mapping) {
    for (var i = 0; i < mapping.length; i++) {
      var map = mapping[i];
      urlString = urlString.replace(map.from, map.to);
    }
  }
  var options = {
    timeout: 15000,
    method: method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  if (cookies != null) options.headers.Cookie = cookies;
  if (method == "GET" && parameters != "" && parameters != null) {
    urlString += urlString.indexOf("?") > 0 ? "&" : "?";
    urlString += parameters;
  } else if (method == "POST" && parameters != "" && parameters != null) {
    options.headers["Content-Length"] = Buffer.byteLength(parameters);
  }
  var url = new URL(urlString);
  /* options.hostname = url.hostname;
  options.port = url.port;
  options.path = url.pathname; */
  var httpClient = url.protocol == "https:" ? https : http;
  var body = "";
  const req = httpClient.request(urlString, options, (res) => {
    //console.log(`状态码: ${res.statusCode}`);
    //console.log(`响应头: ${JSON.stringify(res.headers)}`);
    if (res.statusCode > 200) {
      var message = `error on ajax ${urlString}: statusCode ${res.statusCode}`;
      //console.error(message);
      //callback(null);
      error(message);
    } else {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        //console.log(`响应主体: ${chunk}`);
        body += chunk;
      });
      res.on("end", () => {
        //console.log('响应中已无数据');
        callback(body);
      });
    }
  });

  req.on("error", (e) => {
    var message = `error on ajax ${urlString}: ${e.message}`;
    //console.error(message);
    //callback(null);
    error(message);
  });
  if (method == "POST" && parameters != "" && parameters != null)
    req.write(parameters);
  req.end();
}

/*module.exports=test;
function test(){
	var path = "Http://www.baidu.com/1/2/3/ni.html";
	var rootPath = getRootPath(path);
	var regex = "("+rootPath+"/?)";
	var pattern = new RegExp(regex, "g");
	path = path.replace(pattern, "");
	if(path.endsWith("/"))path+="end";
	var paths = path.split("/");
	paths.pop();
	var url = getRealUrl(rootPath, paths, "/a1.data");
	console.log(url);
	var result = ajax(rootPath, paths, "post", "/a1.data", "id=2&no=4", "LazyPageSpider=0");
	console.log(result);
}*/

module.exports = ajax;
