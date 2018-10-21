var express = require('express');
let User = require('../models/users');
let Course = require('../models/courses');
let morsecodes = require('../models/morsecodes');
var router = express.Router();
let mongoose = require('mongoose');
var mongodbUri ='mongodb://User1:testUser1@ds137643.mlab.com:37643/morsedb';


//mongoose.connect('mongodb://localhost:27017/morsedb');
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

//REFACTORED
/* GET users listing. */
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(users,null,5));
    });
}
//REFACTORED
router.deleteUser = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send({message:"User not Deleted",errmsg:err});
        else
            res.send('User Deleted');
    });
}
//REFACTORED
router.courselist=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    User.findById(req.params.id ,function(err, result) {
        if (err)
            res.send({message:"User not Found",errmsg:err});

        Course.find(function(err, courses) {
            if (err)
                res.send({message:"no Courses found",errmsg:err});

            var courselist=getCoursesByUserID(courses,req.params.id);
            courselist=transformcontentToObjects(courselist);
            res.send(JSON.stringify(courselist,null,5));
        });
    });


};
//REFACTORED
router.findOne=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    User.findById(req.params.id ,function(err, result) {
        if (err)
            res.send({message:"User not Found",errmsg:err});
        if(result!==null)
            res.send(JSON.stringify(result,null,5));
        else
            res.send({message:"User not Found"});
    });

};
router.findByName=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    User.find(function(err, users) {
        if (err)
            res.send(err);
        var temp=[];
        users.filter(function(obj){
            if( obj.name.match(req.params.filter)){
                temp.push(obj);
            }

        } );

        if(temp.length>0)
            res.send(JSON.stringify(temp,null,5));
        else
            res.send({message:"No users found"});
    });

};
//REFACTORED
router.updateName=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    User.findById(req.params.id, function(err,user) {
        if (err)
            res.send({message:"User not Found",errmsg:err});
        else {
            var exception = !req.body.hasOwnProperty('name');
            if (exception) {
                res.status(404).json({ error: 'No Name parameter given, could not update Name' });
                throw 'No Name parameter given';
            }
            if(req.body.name==user.name){
                res.status(404).json({ error: 'New Name same as old Name, no update' });
                throw 'New Name same as old Name, no update';
            }
            user.name = req.body.name;
            user.save(function (err) {
                if (err)
                    res.send({message:"Name not Updated",errmsg:err});
                else
                    res.send(JSON.stringify("Name Updated",null,5));
            });
        }
    });
};
//REFACTORED
router.addUser=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var exception = !req.body.hasOwnProperty('name');

    if (exception) {
        res.status(404).json({ error: 'No Name parameter given, could not add user' });
        throw 'No Name parameter given';
    }
    var newuser= new User();
    newuser.name=req.body.name;

    newuser.save(function(err) {
        if (err)
            res.send({message:"User not Added",errmsg:err});
        else
            res.json({ message: 'User Added!'});
    });
};
//REFACTORED
router.fullScore=(req,res)=>{
    var fullscore={fullscore:0};
    res.setHeader('Content-Type', 'application/json');

    User.findById(req.params.id ,function(err, result) {
        if (err)
            res.send({message:"User not Found",errmsg:err});

        Course.find(function(err, courses) {
            if (err)
                res.send({message:"no Courses found",errmsg:err});

            var temp=getCoursesByUserID(courses,req.params.id);
            temp.forEach(function(element) {
                fullscore.fullscore+=element.score;
            });
            res.send(JSON.stringify(fullscore),null,5);
        });
    });

};

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}
function getCoursesByUserID(array, id) {
    var result  = array.filter(function(obj){return obj.userId == id;} );
    return result ? result : null; // or undefined
}
function transformcontentToObjects (courses){
    let temp=[];
    courses.forEach(function(course){
        course.coursecontent.forEach(function(element) {
            temp.push(morsecodes.find(function(item){
                return element==item.id;
            }));
        });
        course.coursecontent=temp;
    });


    return courses;
};
module.exports = router;
