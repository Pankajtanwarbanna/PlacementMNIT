const jwt = require('jsonwebtoken');
let secret = process.env.SECRET;

exports.encode = (data) => {
    return jwt.sign({student_name:data.student_name,college_id:data.college_id}, secret)
};

exports.decode = (token) => {
    return decoded = jwt.verify(token, secret);
};
