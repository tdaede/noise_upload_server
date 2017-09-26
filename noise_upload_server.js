var express = require('express');
var multer = require('multer');
var fs = require('fs');

var app = express();

if (!fs.existsSync('./noise_uploads')) {
  fs.mkdirSync('./noise_uploads');
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/upload',multer({dest: './noise_uploads', limits: {files:1, fileSize: 50000000}}).any());
app.post('/upload', function(req,res) {
  console.log('uploaded',req.file,req.files);
  res.send('ok');
});
app.listen(3001);
