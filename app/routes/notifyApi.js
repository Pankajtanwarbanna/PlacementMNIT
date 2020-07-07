/*
    API written by - Pankaj Tanwar

    Notify.js - API routes for all Notifications via SMS or E-Mail
*/
let User = require('../models/user');
let auth = require('../middlewares/authPermission');
let request = require('request');

// Function to get SMS URL
function getSendSMSApiUrl(sms_contacts,message) {

    let baseURI = process.env.SMS_BASE_URI;
    let SMS_API_KEY = process.env.SMS_API_KEY;
    let campaign = 0;
    let routeid = 5; // Transaction
    let type = 'text'; // Message type
    let contacts = sms_contacts.toString(); // contacts with comma apart
    let senderid = process.env.SMS_SENDERID; // Sender ID
    let msg = encodeURI(message); // encode Message to URI
    console.log(msg);
    return baseURI + 'key=' + SMS_API_KEY + '&campaign=' + campaign + '&routeid=' + routeid + '&type=' + type + '&contacts=' + contacts + '&senderid=' + senderid + '&msg=' + msg;
}

module.exports = function (router){

    // New Coordinator Notification
    router.post('/notifyCoordinatorForRegistration', auth.ensureAdmin, function (req, res) {

        let SMSAPI = getSendSMSApiUrl(
            req.body.alternate_contact_no,
            'Hi '+ req.body.name.split(" ")[0] + ',' +
            '\n' +
            '\n' +
            'Welcome to Placement Cell. Login with College ID ' + req.body.college_email.toUpperCase().split("@")[0] + '-PTP' + ' and '+ req.body.alternate_contact_no + ' as password on portal.' +
            '\n' +
            '\n' +
            'Thanks' +
            '\n' +
            'PTP MNIT Jaipur'
        );

        request.post(
            SMSAPI.toString(),
            { json: { key: 'value' } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(response);
                    //console.log(body);
                    res.json({
                        success : true,
                        message : 'Coordinator created & notified via SMS.'
                    });
                } else {
                    console.log(error);
                    res.json({
                        success : false,
                        error : error,
                        message : 'Account has been created but something went wrong with SMS service.'
                    })
                }
            }
        );

    });

    return router;
};
