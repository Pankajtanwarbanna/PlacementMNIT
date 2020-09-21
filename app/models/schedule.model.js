/* Currently Not Supported in Portal */
var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var scheduleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    start : {
        type : Date,
        required: true
    },
    end : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
scheduleSchema.plugin(titlize, {
    paths: [ 'title' ], // Array of paths
});

module.exports = mongoose.model('schedule',scheduleSchema);
