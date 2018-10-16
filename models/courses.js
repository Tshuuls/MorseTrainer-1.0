//let User = require('../models/users');
let mongoose = require('mongoose');
/*delete mongoose.connection.models['Course'];
delete mongoose.connection.models['User'];*/

let CourseSchema = new mongoose.Schema({
        coursetype: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        score: {type: Number, default: 0},
        coursecontent: Array
    },
    { collection: 'courses' });

module.exports = mongoose.model('Course', CourseSchema);
/*
* db.courses.insert({"coursetype": "morse","userId":ObjectId("5bc5b4ae59b84881d340d2e6"), "score":20, "coursecontent":[4,24,16,12,11]})
* */