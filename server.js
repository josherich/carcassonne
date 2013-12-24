var express   = require('express'),
    fs        = require('fs'),
    app       = express();

app.use("/", express.static(__dirname + '/site'));

// app.get("*", function(req, res) {
//   fs.createReadStream("./index.html").pipe(res);
// });

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.listen(process.env.PORT || 8080);