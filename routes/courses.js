var Course = require('../models/courses');
var User = require('../models/users');
let morsecodes = require('../models/morsecodes');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var mongodbUri ='mongodb://User1:testUser1@ds137643.mlab.com:37643/morsedb';
//var mongodbUri ='mongodb://User1:testUser1@ds137643.mlab.com:37643/testmorsedb';
if (process.env.NODE_ENV === 'test') {
    mongodbUri ='mongodb://User1:testUser1@ds137643.mlab.com:37643/testmorsedb';
}

//mongoose.connect('mongodb://localhost:27017/morsedb');
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Course.find(function(err, courses) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(courses, null, 5));
    });
}
//REFACTORED
router.findOne=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');

    Course.find({ "_id" : req.params.id },function(err, course) {
        if (err)
            res.send({message:"Course not Found",errmsg:err});
        else
            if(course.length==0)
                res.send({message:"Course not Found"});
            else
                res.send(JSON.stringify(course,null,5));
    });

};

//REFACTORED
router.deleteCourse = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Course.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send({message:"Course not Deleted",errmsg:err});
        else
            res.send({message:'Course Deleted'});
    });

}

//REFACTORED
router.updateScore=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    Course.findById(req.params.id ,function(err, course) {
        if (err)
            res.send({message:"Course not Found",errmsg:err});
        else{
            try {
                var exception = !req.body.hasOwnProperty('score');
                if (exception) {
                    throw 'Score Not Updated - No Score parameter given';
                }
                if (req.body.score == course.score) {
                    throw 'Score Not Updated - new score same as old score';
                }
                var temp = course.score;
                course.score = req.body.score;
                course.save(function (err) {
                    if (err) {
                        res.send({message: "Score Not Updated", errmsg: err});
                    }
                    else
                        res.send(JSON.stringify({message: "Score Updated"}, null, 5));
                });
            }catch (err) {
                res.status(404).json({error: err});
            }
        }
    });
};

//REFACTORED
router.transformOne=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');

    Course.findById(req.params.id ,function(err, course) {
        if (err)
            res.send({message:"Course not Found",errmsg:err});
        else
        res.send(JSON.stringify(transformcontentToObjects(course,req.params.id),null,5));
    });

};

//REFACTORED
router.addCourse=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var exception = !req.body.hasOwnProperty('coursetype')||!req.body.hasOwnProperty('userId')||!req.body.hasOwnProperty('length');

    if (exception) {
        res.status(404).json({ error: 'No userId and/or coursetype and/or length parameter given, could not add course' });
        throw 'No userId and/or coursetype and/or length parameter given';
    }

    User.findById(req.body.userId ,function(err, result) {
        if (err)
            res.send({error: "User not Found", errmsg: err});
    });
    exception = req.body.coursetype!="letter"&&req.body.coursetype!="morse";

    if (exception) {
        res.status(404).json({ error: 'Wrong CourseType given, could not add course' });
        throw 'Wrong CourseType given';
    }
    var tempuser= null;
    User.find(function(err, users) {
        if (err)
            res.send(err);
        var temp = [];
        users.filter(function (obj) {
            if (obj.firebaseID.match(req.body.userId)) {
                tempuser = obj;
            }

        });
        var course = new Course();
        course.coursetype = req.body.coursetype;
        course.userId = tempuser._id;
        course.score = 0;
        course.coursecontent = createCourseContent(req.body.length);

        course.save(function (err) {
            if (err)
                res.send({message: "Course not Added", errmsg: err});
            else
                res.json({message: 'Course Added!'});
        });
    });
};


function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

function transformcontentToObjects (course){
    let temp=[];
    course.coursecontent.forEach(function(element) {
        temp.push(morsecodes.find(function(item){
            return element==item.id;
        }));
    });
    course.coursecontent=temp;
    return course;
};

function createCourseContent(length){
    var temp=[];
    var random=0;
    var prevrand=0;
    for (i = 0; i < length; i++) {
        while(prevrand==random){
            random= Math.floor(Math.random() * 26) + 1;
        }
        prevrand=random;

        temp.push(morsecodes.find(function(item){
            if (random==item.id){
                return random;
            }

        }));
    }
    return transformcontentToIds(temp);
};

function transformcontentToIds (array){
    let temp=[];
    array.forEach(function(element) {
        temp.push(element.id);
    });
    return temp;
};

router.addTESTCourse=(course,length)=>{
    course.coursecontent=createCourseContent(length);
    course.save(function(err) {
        if (err)
            console.log("Error while adding test course")
        else
            console.log("test course added")

    });

};
router.getTESTCourse=()=>{
    Course.find(function(err, users) {
        if (err)
            console.log("Error while getting test Courses");

        var result  = users.filter(function(obj){return obj.id} );
        return result ? result[0] : null; // or undefined
    });
};
router.deleteTESTCourses=()=>{

    Course.find(function(err, course) {
        if (err)
            console.log(err);

        course.forEach(function(obj){
            Course.findByIdAndRemove(obj.id, function(err) {
                if (err)
                    console.log({message:"Course not Deleted",errmsg:err});
                else
                    console.log('Course Deleted');
            });
        } );
    });

};
module.exports = router;
