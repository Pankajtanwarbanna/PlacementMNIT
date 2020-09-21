var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var interviewSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    experience : {
        type : String,
        required : true
    },
    tags : [String],
    author_id : {
        type : String,
        required : true
    },
    author_name : {
        type : String,
        required : true
    },
    created_at : {
        type : Date,
        default : Date.now(),
        required : true
    },
    status : {
        type : String,
        default : 'pending', // status can be pending or approved
        required : true
        // todo enums
    }
});

module.exports = mongoose.model('interview',interviewSchema);
