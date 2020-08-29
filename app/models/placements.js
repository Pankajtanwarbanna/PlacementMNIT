let mongoose = require('mongoose');
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
    // Intern or Full Time
    recruitment : {
        type : String,
        required : true
    },
    // If Intern
    intern_duration : {
        type : String
    },
    // In both cases
    package : {
        type : String
    },
    // If Full time - PPO or Campus Placement
    placement : {
        type : String
    },
    student_college_id : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Placements',placementsSchema);
