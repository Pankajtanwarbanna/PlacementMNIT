let nodemailer = require('nodemailer');
const templateService = require('../services/template.service');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.PTP_EMAIL,
        pass: process.env.PTP_EMAIL_PASSWORD
    }
});

async function sendDM(user, mailType) {

    try {
        const opts = templateService.getEmailOpts(user, mailType);

        const data = await transporter.sendMail(opts);

        return { success : true, message : 'Email sent.', data : data }
    }
    catch (err) {
        return { success : false, message : 'Email service not working.' , error : err}
    }
}

exports.sendDM = sendDM;
