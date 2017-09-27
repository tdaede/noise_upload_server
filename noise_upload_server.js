var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var RateLimit = require('express-rate-limit');

var app = express();

if (!fs.existsSync('./noise_uploads')) {
  fs.mkdirSync('./noise_uploads');
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './noise_uploads');
  },
  filename: function (req, file, cb) {
    cb(null, req.ip + '-' + Date.now() + '.raw');
  }
})


var apiLimiter = new RateLimit({
  windowMs: 60*1000, // 1 minute
  max: 10, // 10 uploads
  delayMs: 0 // disabled
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/upload',apiLimiter);
app.use('/upload',multer({dest: './noise_uploads', limits: {files:1, fileSize: 6000000}, storage: storage}).any());
app.post('/upload', function(req,res) {
  console.log('uploaded',req.files);
  fs.writeFile('./noise_uploads/' + path.parse(req.files[0].filename).name + '.txt', req.get('User-Agent'));
  res.send('ok');
});
app.set('trust proxy', true);
app.listen(3011);
