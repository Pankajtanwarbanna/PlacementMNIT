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
        required : true
    },
    college_id : {
        type : String,
        required : true,
        unique : true
    },
    program : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    contact_no : {
        type : String,
        required : true
    },
    college_email : {
        type : String,
        required : true
    },
    alternate_email : {
        type : String,
        required : true
    },
    degree : {
        type : String,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    active : {
        type : Boolean,
        required : true,
        default : true
    },
    temporarytoken : {
        type : String,
        required : true
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
    paths: [ 'name' ], // Array of paths
});

// Password compare method
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);
