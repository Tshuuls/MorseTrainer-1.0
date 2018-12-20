var express = require('express');
let User = require('../models/users');
let Course = require('../models/courses');
let morsecodes = require('../models/morsecodes');
var router = express.Router();
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
    var tempuser= null;
    User.find(function(err, users) {
        if (err)
            res.send(err);
        var temp = [];
        users.filter(function (obj) {
            if (obj.firebaseID.match(req.params.id.toString())) {
                tempuser = obj;
            }

        });
        if (temp.length != null) {

            Course.find(function (err, courses) {
                if (err)
                    res.send({message: "no Courses found", errmsg: err});
                else {
                    var courselist = getCoursesByUserID(courses, tempuser._id);

                    if (courselist.length == 0) {
                        console.log("no courses to delete for" + tempuser._id)
                        User.findByIdAndRemove(tempuser._id, function (err) {
                            if (err)
                                res.send({message: "User not Found", errmsg: err});
                            else
                                res.send({message: 'User Deleted'});
                        });
                    }
                    else {
                        courselist.forEach(function (item) {
                            Course.findByIdAndRemove(item._id, function (err) {
                                if (err)
                                    console.log("course deleted" + item._id)
                                else
                                    console.log("course not deleted" + item._id)
                            });
                        })

                        User.findByIdAndRemove(tempuser._id, function (err) {
                            if (err)
                                res.send({message: "User not Found", errmsg: err});
                            else
                                res.send({message: 'User Deleted'});
                        });
                    }

                }
            });
        }
        else
            res.send({message: "No users found with: " + req.params.id});

    });



}
//REFACTORED
router.courselist=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');
    var tempuser= null;
    User.find(function(err, users) {
        if (err)
            res.send(err);
        var temp=[];
        users.filter(function(obj){
            if( obj.firebaseID.match(req.params.id)){
                tempuser=obj;
            }
        } );
        if(temp.length!=null){

            Course.find(function(err, courses) {
                if (err)
                    res.send({message:"no Courses found",errmsg:err});
                else {
                    var courselist = getCoursesByUserID(courses, tempuser._id);

                    if (courselist.length == 0) {
                        res.send({message: "no Courses found for user: " + tempuser._id});
                    }
                    else {
                        courselist = transformcontentToObjects(courselist);
                        res.send(JSON.stringify(courselist, null, 5));
                    }

                }
            });
        }
        else
            res.send({message:"No users found with: "+req.params.id});
    });

    /*User.findById(req.params.id ,function(err, users) {
        if (err)
            res.send({message:"User not Found",errmsg:err});
        else{
            //console.log(users);
            Course.find(function(err, courses) {
                if (err)
                    res.send({message:"no Courses found",errmsg:err});
                else{
                    var courselist=getCoursesByUserID(courses,req.params.id);
                    //console.log(req.params.id);
                    //console.log(courselist);
                    if(courselist.length==0){
                        res.send({message:"no Courses found for user: "+req.params.id,errmsg:err});
                    }
                    else{
                        courselist=transformcontentToObjects(courselist);
                        res.send(JSON.stringify(courselist,null,5));
                    }

                }

            });
        }

    });*/


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
            if( obj.email.match(req.params.filter)){
                temp.push(obj);
            }

        } );
        if(temp.length>0)

            res.send(JSON.stringify(temp,null,5));
        else
            res.send({message:"No users found with: "+req.params.filter});
    });

};
//REFACTORED
router.updateName=(req,res)=>{

    res.setHeader('Content-Type', 'application/json');

    User.findById(req.params.id, function(err,user) {
        if (err)
            res.send({message:"User not Found",errmsg:err});
        else {
            try {
                var exception = !req.body.hasOwnProperty('email');
                if (exception) {
                    throw 'No email parameter given';
                }
                if (req.body.email == user.email) {
                    throw 'New Email same as old Email, no update';
                }
                user.email = req.body.email;
                user.save(function (err) {
                    if (err)
                        res.send({message: "Email not Updated", errmsg: err});
                    else
                        res.send(JSON.stringify({message:"Email Updated"}, null, 5));
                });
            }catch (err) {
                res.status(404).json({error: err});
            }
        }
    });
};
//REFACTORED
router.addUser=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var exception = !req.body.hasOwnProperty('email')||!req.body.hasOwnProperty('id');

    if (exception) {
        res.status(405).json({ error: 'No Name or FirebaseID parameter given, could not add user' });
        throw 'No Name parameter given';
    }
    var newuser= new User();
    newuser.email=req.body.email;
    newuser.firebaseID=req.body.id;

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
        else{
            Course.find(function(err, courses) {
                if (err)
                    res.send({message:"no Courses found",errmsg:err});
                else{
                    var temp=getCoursesByUserID(courses,req.params.id);
                    if(temp.length==0){
                        res.send({message:"no Courses found for user: "+req.params.id,errmsg:err});
                    }else{
                        temp.forEach(function(element) {
                            fullscore.fullscore+=element.score;
                        });
                        res.send(JSON.stringify(fullscore),null,5);
                    }

                }

            });
        }

    });

};

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}
function getCoursesByUserID(array, id) {
    var result  = array.filter(function(obj){return obj.userId.toString() == id;} );
    return result ? result : null; // or undefined
}
function transformcontentToObjects (courses){
    let temp=[];
    courses.forEach(function(course){
        temp=[]
        course.coursecontent.forEach(function(element) {
            temp.push(morsecodes.find(function(item){
                return element==item.id;
            }));
        });
        course.coursecontent=temp;
    });


    return courses;
};

router.addTESTUser=(user)=>{
        user.save(function(err) {
            if (err)
                console.log("Error while adding test USer");

        });
};

router.getTESTUser=()=>{
    User.find(function(err, users) {
        if (err)
            console.log("Error while getting test USer");

        var result  = users.filter(function(obj){return obj.id} );
        return result ? result[0] : null; // or undefined
    });
};

router.deleteTESTUser=()=>{

    User.find(function(err, users) {
        if (err)
            console.log(err);

        users.filter(function(obj){
            User.findByIdAndRemove(obj.id, function(err) {
                if (err)
                    console.log({message:"User not Deleted",errmsg:err});
                else
                    console.log('User Deleted');
            });
        } );
    });

};

module.exports = router;
