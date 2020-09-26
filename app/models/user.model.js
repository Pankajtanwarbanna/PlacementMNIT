var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
mongoose.set('useCreateIndex', true);

// Backend mongoose validators
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,10})+[ ]+([a-zA-Z]{3,10})+)+$/,
        message : 'Name must have minimum 3 and maximum 20 character, Space in between the name, No special letters or numbers!'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W]).{8,25}$/,
        message : 'Password must have one lowercase, one uppercase, one special character, one number and minimum 8 and maximum 25 character'
    }),
    validate({
        validator: 'isLength',
        arguments: [8,25],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var userSchema = new mongoose.Schema({
    student_name : {
        type : String,
    },
    college_id : {
        type : String,
        unique : true
    },
    passout_batch : {
        type : String
    },
    program : {
        type : String,
    },
    gender : {
        type : String,
        default : 'M'
    },
    status : {
        type : String,
    },
    contact_no : {
        type : String,
    },
    college_email : {
        type : String,
    },
    alternate_email : {
        type : String,
    },
    degree : {
        type : String,
    },
    department : {
        type : String,
    },
    cgpa : {
        type : String,
    },
    matric_marks : {
        type : String
    },
    matric_board : {
        type : String
    },
    senior_marks : {
        type : String
    },
    senior_board : {
        type : String
    },
    alternate_contact_no : {
        type : String
    },
    address : {
        type : String
    },
    city : {
        type : String
    },
    post_code : {
        type : String
    },
    state : {
        type : String
    },
    country : {
        type : String
    },
    linkedln_link : {
        type : String
    },
    login_otp : {
        type : String
    },
    resume_url : {
        type : String
    },
    password : {
        type : String
        //select : false
    },
    active : {
        type : Boolean,
        default : true
    },
    temporarytoken : {
        type : String,
    },
    permission : {
        type : String,
        required : true,
        default: 'student'
    }
});

userSchema.pre('save', function (next) {

    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if(err) {
            return next(err);
            //res.send('Error in hashing password');
        } else {
            user.password = hash;
            next();
        }
    });
});

// Mongoose title case plugin
userSchema.plugin(titlize, {
    // addition here also
    paths: ['address','city','state','country' ], // Array of paths
});

// Password compare method
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);

