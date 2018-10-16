var Course = require('../models/courses');
var User = require('../models/users');
let morsecodes = require('../models/morsecodes');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/morsedb');

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

router.findOne=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');

    Course.find({ "_id" : req.params.id },function(err, course) {
        if (err)
            res.send({message:"Course not Found",errmsg:err});
        else
            res.send(JSON.stringify(course,null,5));
    });

};

router.deleteCourse = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    var course=getByValue(courses,req.params.id);
    if (course==null){
        res.status(404).json({ error: 'Course not found' });
        throw 'Course not found';
    } else{
        var currentSize = courses.length;
        var index=courses.indexOf(course);
        courses.splice(index, 1);
        if((currentSize - 1) == courses.length)
            res.send('Course Deleted');
        else
            res.send('Course NOT Deleted');
    }
}

router.updateScore=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    Course.findById(req.params.id ,function(err, course) {
        if (err)
            res.send({message:"Course not Found",errmsg:err});
        else{
            var exception = !req.body.hasOwnProperty('score');
            if (exception) {

                res.send({message:"Score Not Updated - No Score parameter given",errmsg:err});
            }
            if(req.body.score==course.score){
                res.send({message:"Score Not Updated - new score same as old score",errmsg:err});
            }
            var temp=course.score;
            course.score=req.body.score;
            course.save(function (err) {
                if (err) {
                    res.send({message:"Score Not Updated",errmsg:err});
                }
                else
                res.send(JSON.stringify("Score Updated",null,5));
            });



        }

    });

};

router.transformOne=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    var checkForCourse=getByValue(courses,req.params.id);
    if (checkForCourse==null){
        res.status(404).json({ error: 'Course not found' });
        throw 'Course not found';
    }
    res.send(JSON.stringify(transformcontentToObjects(courses,req.params.id),null,5));
};

router.addCourse=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var exception = !req.body.hasOwnProperty('coursetype')||!req.body.hasOwnProperty('userId');

    if (exception) {
        res.status(404).json({ error: 'No userId and/or coursetype parameter given, could not add course' });
        throw 'No userId and/or coursetype parameter given';
    }
    var checkForUser=getByValue(users,req.body.userId);
    if (checkForUser==null){
        res.status(404).json({ error: 'User not found' });
        throw 'User not found';
    }
     exception = req.body.coursetype!="letter"&&req.body.coursetype!="morse";

    if (exception) {
        res.status(404).json({ error: 'Wrong CourseType given, could not add course' });
        throw 'Wrong CourseType given';
    }
     var currentSize= courses.length;
    var id = Math.floor(Math.random() * 2000000) + 1000000; //Randomly generate an id
    var course= {};
    course.id=id;
    course.coursetype=req.body.coursetype;
    course.userId=req.body.userId;
    course.score=0;
    course.coursecontent=createCourseContent(req.body.length);

    res.send(JSON.stringify(course,null,5));
    courses.push(course);
    if((currentSize + 1) == courses.length)
        res.json({ message: 'Course Added!'});
    else {
        res.status(404).json({error: 'Course not added'});
        throw 'Course not added';
    }
};


function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

function transformcontentToObjects (courses,id){
    let course = getByValue(courses,id);
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
module.exports = router;