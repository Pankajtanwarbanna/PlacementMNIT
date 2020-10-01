const from = '"Placement Portal" <placementportal@mnit.ac.in>';
const baseUrl = 'http://placements.mnit.ac.in';
const email_signature = '<br><br>With Regards.<br><br>Prof. Mahender Choudhary<br>In-charge, Training & Placement<br>MNIT Jaipur<br>+91-141-2529065';

exports.getEmailOpts = (data, mailType) => {

    switch (mailType) {

        case 'sendOTP':
            return {
                from : from,
                to:  data.college_email,
                subject: 'Login Request : Placement Cell, MNIT Jaipur',
                text: 'Hello '+ data.student_name + 'We have received a login request for your account.Please find the below OTP to proceed further With Regards, Prof. Mahendar Choudhary',
                html: 'Hello <strong>'+ data.student_name + '</strong>,<br><br>A sign in attempt to Placement Portal requires further verification to prevent unauthorized access to your account. To complete the sign in, enter the verification code on the Placement Portal.<br><br>Verification Code: ' + data.login_otp + email_signature
            }
            break;

        case 'forgotPassword':
            return {
                from: from,
                to: data.college_email,
                subject: 'Reset Password Request : Placement Cell, MNIT Jaipur',
                text: 'Hello '+ data.student_name + 'You requested for the reset password.Please find the below link Reset password With Regards, Prof. Mahendar Choudhary',
                html: 'Hello <strong>'+ data.student_name + '</strong>,<br><br>You requested for the reset password. Please find the below link<br><br><a href="' + baseUrl + "/forgotPassword/" + data.temporarytoken + '">Reset password</a>'+ email_signature
            }
            break;

        case 'passwordUpdated':
            return {
                from: from,
                to: data.college_email,
                subject: 'Password Updated : Placement Cell, MNIT Jaipur',
                text: 'Hello '+ data.student_name + 'Your password has been successfully updated.With Regards, Prof. Mahendar Choudhary',
                html: 'Hello <strong>'+ data.student_name + '</strong>,<br><br>Your password has been successfully updated.'+ email_signature
            }
            break;

        case 'approveInterviewExperience':
            return {
                from: from,
                to: data.author_id + '@mnit.ac.in',
                subject: 'Yay! We have published your article ' + data.title,
                text: 'Hello '+ data.author_name + 'Thanks for sharing your interview process and thoughts with us With Regards, Prof. Mahendar Choudhary',
                html: 'Hello <strong>'+ data.author_name + '</strong>,<br><br>Thanks for sharing your interview process and thoughts with us to help others. We have published your interview experience after a few modifications. We wish you luck for the future! Please find the link below -<br><br><a href="' + baseUrl + "/experience/" + data._id + '">' + data.title + ' </a>'+ email_signature
            };

        default:
            return {}
    }

}

exports.getSMSOpts = (data, smsType) => {

    switch (smsType) {

        case 'addCoordinator':
            return 'Hi '+ data.name.split(" ")[0] + ',' +
                '\n' +
                '\n' +
                'Welcome to Placement Cell. Login with College ID ' + data.college_email.toUpperCase().split("@")[0] + '-PTP' + ' and '+ data.alternate_contact_no + ' as password on portal.' +
                '\n' +
                '\n' +
                'Thanks' +
                '\n' +
                'PTP MNIT Jaipur'
            break;

        default:
            return {}
    }

}
