const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

let redFlagSchema = new mongoose.Schema({
    redFlag : {
        type : Number,
        required : true
    },
    active : {
        type : Boolean,
        required : true,
        default : true
    },
    reason : {
        type : String,
        required : true,
        trim : true
    },
    assignee : {
        type : String,
        required : true
    },
    receiver : {
        type : String,
        required : true
    },
    remover : {
        type : String
    },
    remove_timestamp : {
        type : Date
    },
    timestamp : {
        type : Date,
        required : true,
        default : new Date()
    }
});

module.exports = mongoose.model('RedFlag',redFlagSchema);
