// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000
//
// express()
//     .use(express.static(path.join(__dirname, 'public')))
//     .set('views', path.join(__dirname))
//     .engine('html', require('ejs').renderFile)
//     .set('view engine', 'html')
//     .get('/', (req, res) => res.render('index'))
//     .listen(PORT, () => console.log(`Listening on ${ PORT }`))


var express = require('express')
var app = express();

var port = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.render('index');
})

app.listen(port, function () {
    console.log('app running')
})
