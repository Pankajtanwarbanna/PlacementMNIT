let request = require('request');
const templateService = require('../services/template.service');

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

    return baseURI + 'key=' + SMS_API_KEY + '&campaign=' + campaign + '&routeid=' + routeid + '&type=' + type + '&contacts=' + contacts + '&senderid=' + senderid + '&msg=' + msg;
}

async function sendDM(user, smsType) {

    try {
        const message = templateService.getSMSOpts(user, smsType);
        const notif = await request.post(getSendSMSApiUrl(user.alternate_contact_no, message).toString(), { json: { key: 'value' } });
        return { success : true, message : 'SMS sent.', data : notif }
    }
    catch (err) {
        return { success : false, message : 'SMS service not working.' , error : err}
    }
}

exports.sendDM = sendDM;
