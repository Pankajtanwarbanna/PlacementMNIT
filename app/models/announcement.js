var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var announcementSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    announcement : {
        type: String,
        required: true
    },
    timestamp : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
announcementSchema.plugin(titlize, {
    paths: [ 'category' ], // Array of paths
});

module.exports = mongoose.model('announcement',announcementSchema);