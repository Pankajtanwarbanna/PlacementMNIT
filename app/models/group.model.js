const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Constant = require('../config/constant')

let groupSchema = new mongoose.Schema({
    branchCode : {
        type : String,
        trim : true,
        required : true
    },
    branchName : {
        type : String,
        trim : true,
        required : true
    },
    courseDuration : {
        type : Number,
        required : true
    },
    programName : {
        type : String,
        enum : Constant.programs,
        required : true
    },
    timestamp : {
        type : Date,
        required : true,
        default : new Date()
    }
});

module.exports = mongoose.model('Group',groupSchema);
