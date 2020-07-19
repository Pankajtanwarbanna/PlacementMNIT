let mongoose = require('mongoose');
let titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

let announcementSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true
    },
    announcement : {
        type: String,
        required: true
    },
    passout_batch : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
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
