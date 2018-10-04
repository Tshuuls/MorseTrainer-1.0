let courses = require('../models/courses');
let morsecodes = require('../models/morsecodes');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(courses,null,5));
}

router.findOne=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(getByValue(courses,req.params.id),null,5));
};

router.transformOne=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(transformcontentToObjects(courses,req.params.id),null,5));
};

router.addCourse=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
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
    else
        res.json({ message: 'Course NOT Added!'});
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