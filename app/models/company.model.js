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
    organization_type : {
        type : String
    },
    industry_sector : {
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
    passout_batch : {
        type : String,
        required : true
    },
    recruitment : {
        type : String
    },
    duration : {
        type : String
    },
    posting_location : {
        type : String
    },
    joining_date : {
        type : Date
    },
    job_description : {
        type : String
    },

    // student eligibility
    eligibility : {
        type : Object
    },
    min_cgpa : {
        type : String // todo convert float
    },
    min_10_percent : {
        type : String
    },
    min_12_percent : {
        type : String
    },
    medical_requirement : {
        type : String
    },
    service_agreement : {
        type : String
    },
    service_agreement_duration : {
        type : String
    },
    other_eligibility : {
        type : String
    },

    // Package Details
    package : {
        type : Object
    },
    company_accommodation : {
        type : String
    },
    other_facility : {
        type : String
    },

    // Selection Process
    selection_process : {
        type : Object
    },
    waitlist : {
        type : String
    },
    final_offer : {
        type : String
    },

    // registration deadline
    deadline_date : {
        type : Date,
        required : true
    },

    // Students registration
    // tempo attendance status
    attendance : {
        type : Boolean
    },
    company_otp : {
        type : String
    },
    candidates : [{
        college_id : {
            type : String,
            required: true
        },
        candidate_status : {
            type : String,
            default : 'Applied',
            enum : ['Applied','Appeared for Test','Absent','Shortlisted','Selected']
        },
        timestamp : {
            type : Date,
            required : true
        }
    }],
    timestamp: {
        type : Date,
        required : true,
        default: Date.now()
    }
});

// Mongoose title case plugin
companySchema.plugin(titlize, {
    paths: [ 'company_name','job_profile', 'posting_location'], // Array of paths
});

module.exports = mongoose.model('company',companySchema);
