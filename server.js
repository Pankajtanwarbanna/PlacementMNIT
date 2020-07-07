let express  = require('express');
let app = express();
require('dotenv').config();
let morgan = require('morgan');     // middleware to log http requests
let port = process.env.PORT || 80; // localhost : PORT=8080 nodemon server.js
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let router = express.Router();
let apiRoutes = require('./app/routes/api')(router); // Student APIs
let adminApiRoutes = require('./app/routes/adminApi')(router); // Admin APIs
let notifyApiRoutes = require('./app/routes/notifyApi')(router); // Notification APIs

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// diff. front end and backend routes
app.use('/api', apiRoutes, adminApiRoutes, notifyApiRoutes);

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
