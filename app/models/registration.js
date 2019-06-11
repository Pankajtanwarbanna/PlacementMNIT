var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var registrationSchema = new mongoose.Schema({
    company_id : {
        type : String,
        required : true
    },
    candidates : [{
        college_id : {
            type : String,
            required: true
        },
        candidate_status : {
            type : String,
            default : 'Applied',
            enum : ['Applied','Appeared','Shortlisted','Selected']
        },
        timestamp : {
            type : Date,
            required : true
        }
    }]
});

module.exports = mongoose.model('registration',registrationSchema);