/*
Scope - Able to generate OTP of given length
      - In future, OTP having [a-z,A-Z] can be think of for security purpose
*/
exports.generateOTP = () => {

    let max = 99999;
    let min = 10000;

    return (Math.floor(Math.random() * (+max - +min)) + +min).toString();

};

exports.calculateRedFlags = (redFlagHistory) => {
    return redFlagHistory.reduce((flags, history) => {
        return flags + (history.active ? history.redFlag : 0);
    },0);
};
