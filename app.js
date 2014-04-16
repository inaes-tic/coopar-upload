var express = require('express'),
    morgan  = require('morgan'),
    busboy = require('connect-busboy'),
    fs = require('fs'),
    sleep = require('sleep'),
    ImageTypes = require('./ImageTypes'),
    multiparty = require('multiparty')
, util = require('util')
, moment = require('moment');

var app = express(),
    PORT = 3000;

app.use(express.static('public'))
app.use(morgan('dev'));
app.set('view engine', 'dot' );
app.engine('dot', require('express-dot').__express );

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});


app.route('/')
    .get(function(req, res, next) {
        res.render('form', { layout: false });
    });


app.route('/upload')
    .post(handleUpload);

app.route('/upload/:user')
    .post(handleUpload);

app.route('//upload/:user')
    .post(handleUpload);

function handleUpload(req, res, next){
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        files.file.forEach (function (file) {
            saveFile(file, req.params.user);
        });
//        sleep.sleep(4);

        res.setHeader('Content-Type', 'text/plain');
  //      res.render('success', { layout: false});
        res.end(util.inspect({fields: fields, files: files}));
    });

}

function saveFile(file, name) {
    var fileData = fs.readFileSync(file.path),
        savePath = getSavePath(file, name);

    console.log("Saving in " + savePath);
    fs.writeFileSync(savePath, fileData);
    console.log("...done.");
}

function getSavePath(file, name) {
    return (__dirname + '/uploads/' + name + '-' + moment().format("YYYY-MM-DD-HH-mm") + '-' + file.originalFilename);
}

app.listen(PORT);
console.log('Listening on port ' + PORT);
