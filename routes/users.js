var express = require('express');
let users = require('../models/users');
let courses = require('../models/courses');
var router = express.Router();

/* GET users listing. */
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users,null,5));
}


router.findOne=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(getByValue(users,req.params.id),null,5));
};

router.addUser=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var currentSize= users.length;
    var id = Math.floor(Math.random() * 3000000) + 2000000; //Randomly generate an id
    var user= {};
    user.id=id;
    user.name=req.body.name;

    users.push(user);
    if((currentSize + 1) == users.length)
        res.json({ message: 'User Added!'});
    else
        res.json({ message: 'User NOT Added!'});
};

router.fullScore=(req,res)=>{
    var fullscore={fullscore:0};
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

module.exports = router;
