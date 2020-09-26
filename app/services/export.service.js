function resumes(data) {
    let files = [];

    data.forEach(function (student) {
        let data = {};

        // todo Check if file exists
        data.name = student.student_name.split(' ').join('_') + '_' + student.college_id + '.pdf';
        data.path = __basedir + '/public/assets/uploads/resumes/' + student.resume_url;

        files.push(data);
    });

    return files;
}

exports.resumes = resumes;
