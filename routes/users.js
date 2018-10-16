var express = require('express');
let User = require('../models/users');
let Course = require('../models/courses');
let morsecodes = require('../models/morsecodes');
var router = express.Router();
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/morsedb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


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

router.deleteUser = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    var user=getByValue(users,req.params.id);
    if (user==null){
        res.status(404).json({ error: 'User not found' });
        throw 'User not found';
    } else{
        var currentSize = users.length;
        var index=users.indexOf(user);
        users.splice(index, 1);
        if((currentSize - 1) == users.length)
            res.send('User Deleted');
        else
            res.send('User NOT Deleted');
    }
}
router.courselist=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    var result=getByValue(users,req.params.id);
    if (result==null){
        res.status(404).json({ error: 'User not found' });
        throw 'User not found';
    }
    var courselist=getCoursesByUserID(courses,req.params.id);
    courselist=transformcontentToObjects(courselist);
    res.send(JSON.stringify(courselist,null,5));

};

router.findOne=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    var result=getByValue(users,req.params.id);
    if (result==null){
        res.status(404).json({ error: 'User not found' });
    } else{
        res.send(JSON.stringify(result,null,5));
    }
};

router.updateName=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    var user=getByValue(users,req.params.id);
    if (user==null){
        res.status(404).json({ error: 'User not found' });
    }
    var exception = !req.body.hasOwnProperty('name');
    if (exception) {
        res.status(404).json({ error: 'No Name parameter given, could not update Name' });
        throw 'No Name parameter given';
    }
    if(req.body.name==user.name){
        res.status(404).json({ error: 'New Name same as old Name, no update' });
        throw 'New Name same as old Name, no update';
    }
    var temp=user.name;
    user.name=req.body.name;
    if(temp!=user.name){
        res.send(JSON.stringify("Name Updated",null,5));
    }else{
        res.status(404).json({ error: 'Name not Updated' });
        throw 'Name not Updated';
    }
};

router.addUser=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var exception = !req.body.hasOwnProperty('name');

    if (exception) {
        res.status(404).json({ error: 'No Name parameter given, could not add user' });
        throw 'No Name parameter given';
    }
    var currentSize= users.length;
    var id = Math.floor(Math.random() * 3000000) + 2000000; //Randomly generate an id
    var user= {};
    user.id=id;
    user.name=req.body.name;

    users.push(user);
    if((currentSize + 1) == users.length)
        res.json({ message: 'User Added!'});
    else
        res.status(404).json({ error: 'User not added' });
};

router.fullScore=(req,res)=>{
    var fullscore={fullscore:0};
    var result=getByValue(users,req.params.id);
    if (result==null){
        res.status(404).json({ error: 'User not found' });
        throw 'User not found';
    }
    res.setHeader('Content-Type', 'application/json');
    var temp=getCoursesByUserID(courses,req.params.id);
    temp.forEach(function(element) {
        fullscore.fullscore+=element.score;
    });
    res.send(JSON.stringify(fullscore),null,5);
    //res.send(fullscore);
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
