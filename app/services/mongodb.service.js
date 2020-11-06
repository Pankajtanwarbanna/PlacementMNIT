const mongoose = require('mongoose');

exports.connect = () => {
    // connecting to mongo database
    mongoose.connect('mongodb://127.0.0.1/placementmnit', { useNewUrlParser: true, useFindAndModify: false ,useUnifiedTopology: true }, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log('Successfully connected to database.');
        }
    });
}
