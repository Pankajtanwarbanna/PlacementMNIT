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
    other_eligibility : {
        type : String
    },

    // registration deadline
    deadline_date : {
        type : Date,
        required : true
    },

    // Students registration
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
        required : true
    },
    company_schedule : [{
        date_time : {
            type : Date,
            required : true
        },
        schedule_info : {
            type : String,
            required : true
        },
        timestamp : {
            type : Date,
            required : true
        }
    }],
    company_notifications : [{
        notification : {
            type : String,
            required : true
        },
        timestamp : {
            type : Date,
            required : true
        }
    }],
    company_result : [{
        result_title : {
            type : String,
            required : true
        },
        candidates : [String],
        result_message : {
            type : String,
            required : true
        },
        result_stage : {
            type : Number,
            required : true
        },
        timestamp : {
            type : Date,
            required : true
        }
    }]

});

// Mongoose title case plugin
companySchema.plugin(titlize, {
    paths: [ 'company_name','job_profile', 'posting_location' ], // Array of paths
});

module.exports = mongoose.model('company',companySchema);