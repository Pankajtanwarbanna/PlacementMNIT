var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var feedbackSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    feedback : {
        type : String,
        required : true
    }
});

// Mongoose title case plugin
feedbackSchema.plugin(titlize, {
    paths: [ 'title' ], // Array of paths
});

module.exports = mongoose.model('Feedback',feedbackSchema);