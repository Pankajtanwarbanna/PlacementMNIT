let mongoose = require('mongoose');
let titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

let placementsSchema = new mongoose.Schema({
    passout_batch : {
        type : String,
        required : true
    },
    company_name : {
        type : String,
        required : true
    },
    job_profile : {
        type : String,
        required : true
    },
    // Intern or Full Time
    recruitment : {
        type : String,
        required : true
    },
    recruitment_type : {
        type : String,
        required : true
    },
    recruitment_date : {
        type : Date,
        required : true
    },
    // If Intern
    intern_duration : {
        type : String
    },
    intern_stipend : {
        type : String,
        default : "0"
    },
    // In both cases
    package : {
        type : String,
        default : "0"
    },
    student_college_id : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    comments  : {
        type : String
    }
});

// Mongoose title case plugin
placementsSchema.plugin(titlize, {
    paths: [ 'company_name', 'job_profile'] // Array of paths
});

module.exports = mongoose.model('Placements',placementsSchema);
