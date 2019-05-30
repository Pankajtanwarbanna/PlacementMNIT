var express  = require('express');
var app = express();
var morgan = require('morgan');             // middleware to log http requests
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var apiRoutes = require('./app/routes/api')(router);

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// diff. front end and backend routes
app.use('/api', apiRoutes);

// URI - 'mongodb://admin:placement123@ds145146.mlab.com:45146/placementmnit'

// connecting to mongo database
mongoose.connect('mongodb://127.0.0.1/placementmnit', { useNewUrlParser: true }, function (err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Successfully connected to database.');
    }
});
// index page
app.get('*', function (req,res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

// server listening on port
app.listen(port, function () {
    console.log('Server running on port '+ port);
});
