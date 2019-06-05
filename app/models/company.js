var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
mongoose.set('useCreateIndex', true);

var companySchema = new mongoose.Schema({
    // Company
    company_name : {
        type : String,
        required : true
    },
    company_website_url : {
        type : String
    },
    about_company : {
        type : String
    },

    // Job Profile
    job_profile : {
        type : String,
        required: true
    },
    posting_location : {
        type : String
    },
    recruitment : {
        type : String
    },
    duration : {
        type : String,
    },
    package : {
        type : String
    },
    other_facility : {
        type : String
    },

    // student
    eligible_programs : [String],
    eligible_branches : [String],
    min_cgpa : {
        type : String // todo convert float
    },
    min_10_percent : {
        type : String
    },
    min_12_percent : {
        type : String
    },
    other_eligibility : {
        type : String
    },

    // registration
    deadline_date : {
        type : Date,
        required : true
    }
});

// Mongoose title case plugin
companySchema.plugin(titlize, {
    paths: [ 'company_name','job_profile', 'posting_location' ], // Array of paths
});

module.exports = mongoose.model('company',companySchema);