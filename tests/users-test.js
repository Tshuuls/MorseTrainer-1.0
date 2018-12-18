let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
let mongoose = require('mongoose');

chai.use(chaiHttp);
let _ = require('lodash' );

var users = require("../routes/users");
var courses = require('../routes/courses');
let User = require('../models/users');
let Course = require('../models/courses');

let mongodbUri ='mongodb://User1:testUser1@ds137643.mlab.com:37643/testmorsedb';

//mongoose.connect('mongodb://localhost:27017/morsedb');
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

var userID="5bcc7c1a078bcd01249cec60";
var userID2="5bcdb1528108fe158219c9e2";
var userID3="5bcdc893586b3617879f6d21";
var userID4=null;
var courseID1="5bcc88768574d7028aac9502";
var courseID2="5bcc8896a5014c029002dc0d";
var courseID3=null;
var uri="";

describe('Users', function (){

<<<<<<< HEAD
    before(function(done){
        User.deleteMany({},function(){
            done();
        });
    });
    before(function(done){
        Course.deleteMany({},function(){
            done();
        });
    });
    before(function(done){
        var newuser= new User();
        newuser.username="Test";
        newuser.email="User1";

        newuser.save(function(err) {
            if (err)
                console.log({message:"User not Added",errmsg:err});
            else{
                console.log({ message: 'User Added!',userID:newuser._id});
                userID=newuser._id.toString();
                done();
            }
        });
    });
    before(function(done){
        var newuser2= new User();
        newuser2.username="Test";
        newuser2.email="User2";

        newuser2.save(function(err) {
            if (err)
                console.log({message:"User not Added",errmsg:err});
            else{
                console.log({ message: 'User Added!',userID:newuser2._id});
                userID2=newuser2._id.toString();
                done();
            }
        });
    });
    before(function(done){
        var newuser3= new User();
        newuser3.username="User";
        newuser3.email="3";

        newuser3.save(function(err) {
            if (err)
                console.log({message:"User not Added",errmsg:err});
            else{
                console.log({ message: 'User Added!',userID:newuser3._id});
                userID3=newuser3._id.toString();
                done();
            }
        });
    });
    before(function(done){

        var course= new Course();
        course.coursetype="morse";
        course.userId=userID;
        course.score=5;
        course.coursecontent=[
            7,
            13,
            21
        ];

        course.save(function(err) {
            if (err)
                console.log({message:"Course not Added",errmsg:err});
            else
            {
                console.log({ message: 'Course Added!',courseID:course._id});
                courseID1=course._id.toString();
                done();
            }
        });
    });
    before(function(done){

        var course2= new Course();
        course2.coursetype="morse";
        course2.userId=userID;
        course2.score=7;
        course2.coursecontent=[
            22,
            1,
            19,
            23,
            7
        ];

        course2.save(function(err) {
            if (err)
                console.log({message:"Course not Added",errmsg:err});
            else
            {
                console.log({ message: 'Course Added!',courseID:course2._id});
                courseID2=course2._id.toString();
                done();
            }
        });
    });
=======

>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
    describe('GET /users',  () => {
        it('should return all the users in an array', function(done) {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (user) => {
<<<<<<< HEAD
                        return { id: user._id, username:user.username,email:user.email}
                    });
                    expect(result).to.include( {id:userID,username:"Test",email:"User1"} );
=======
                        return { id: user._id, name:user.name}
                    });
                    expect(result).to.include( {id:userID,name:"Test User1"} );
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
                    done();
                });
        });
    });

    describe('GET /users:id',  () => {
        it('should return one user', function(done) {

            chai.request(server)
                .get('/users/'+userID)
                .end((err, res) => {
                    expect(res).to.have.status(200);
<<<<<<< HEAD
                    expect(res.body).to.include( {_id:userID,username:"Test",email:"User1"} );
=======
                    expect(res.body).to.include( {_id:userID,name:"Test User1"} );
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
                    done();
                });
        });
        it('should return an error - wrong userID', function(done) {

            chai.request(server)
                .get(uri='/users/'+123)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User not Found' );
                    done();
                });
        });
    });

    describe('GET /users/courselist/:id',  () => {
        it('should return all courses of one user', function(done) {

            chai.request(server)
                .get('/users/courselist/'+userID)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (user) => {
                        return { id: user._id}
                    });
                    expect(result).to.include( {id:courseID1},{id:courseID2} );
                    done();
                });
        });
        it('should return an error - no courses found', function(done) {

            chai.request(server)
                .get('/users/courselist/'+userID2)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('no Courses found for user: '+userID2 );
                    done();
                });
        });
        it('should return an error - wrong userID', function(done) {

            chai.request(server)
                .get('/users/courselist/'+123)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User not Found' );
                    done();
                });
        });
    });

    describe('GET /users/score/:id',  () => {
        it('should return full score of one user', function(done) {

            chai.request(server)
                .get('/users/score/'+userID)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include( {fullscore:12} );
                    done();
                });
        });
        it('should return an error - wrong userID', function(done) {

            chai.request(server)
                .get(uri='/users/score/'+123)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('User not Found' );
                    done();
                });
        });
        it('should return an error - no courses found', function(done) {

            chai.request(server)
                .get('/users/score/'+userID2)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('no Courses found for user: '+userID2 );
                    done();
                });
        });
    });

    describe('GET /users/filter/:filter',  () => {
        it('should return users with test in their name', function(done) {

            chai.request(server)
                .get('/users/filter/Test')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (user) => {
                        return { id: user._id}
                    });
                    expect(result).to.include( {id:userID},{id:userID2} );
                    done();
                });
        });
        it('should return an error - no users with tom', function(done) {

            chai.request(server)
                .get(uri='/users/filter/tom')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('No users found with: tom' );
                    done();
                });
        });
    });
    describe('Post /users',  () => {
        describe('Error Flow',  () => {
            it('should return Error - no name giver', function(done) {
                let user={naame:"Added User"};
                chai.request(server)
                    .post('/users')
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('error').equal('No Name or email parameter given, could not add user' );
                        done();
                    });
            });

        });
        describe('Standart Flow',  () => {
            it('should add User', function(done) {
<<<<<<< HEAD
                let user={username:"Added",email:"User"};
=======
                let user={name:"Added User"};
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
                chai.request(server)
                    .post('/users')
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('User Added!' );
                        done();
                    });
            });after(function  (done) {
                chai.request(server)
                    .get('/users')
                    .end(function(err, res) {

                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(4);
                        let result = _.map(res.body, (user) => {
<<<<<<< HEAD
                            return { username: user.username,email: user.email};
                        }  );
                        expect(result).to.include( { username:"Added",email:"User" } );
=======
                            return { name: user.name};
                        }  );
                        expect(result).to.include( { name: 'Added User'  } );

                        var tempid  = res.body.filter(function(obj){
                            if (obj.name== 'Added User') {
                                return obj ;
                            }
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema

                        } );
                        User.findByIdAndRemove(tempid, function(err) {
                            if (err)
                                console.log({message:"User not Deleted",errmsg:err});
                            else
                                done();
                        });
                    });
            });
        });

    });
    describe('Put /users/:id',  () => {
        describe('Error Flow',  () => {
            it('should return Error - no name given', function(done) {
                let user={naame:"New UserName"};
                chai.request(server)
                    .put('/users/'+userID3)
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('error').equal('No Name parameter given' );
                        done();
                    });
            });
            it('should return Error - wrong ID', function(done) {
                let user={name:"New UserName"};
                chai.request(server)
                    .put('/users/'+123)
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('User not Found' );
                        done();
                    });
            });
            it('should return Error - new name same as old name', function(done) {
<<<<<<< HEAD
                let user={username:"User",email:"3"};
=======
                let user={name:"User 3"};
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
                chai.request(server)
                    .put('/users/'+userID3)
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('error').equal('New Name same as old Name, no update' );
                        done();
                    });
            });
        });
        describe('Standart Flow',  () => {
<<<<<<< HEAD
            it('should change username', function(done) {
                let user={username:"New",email:"UserName"};
=======
            it('should add User', function(done) {
                let user={name:"New UserName"};
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
                chai.request(server)
                    .put('/users/'+userID3)
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Name Updated' );
                        done();
                    });
            });after(function  (done) {
                chai.request(server)
                    .get('/users')
                    .end(function(err, res) {

                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        let result = _.map(res.body, (user) => {
<<<<<<< HEAD
                            return {username: user.username ,email: user.email};
                        }  );
                        expect(result).to.include( { username:"New",email:"UserName"  } );
=======
                            return { name: user.name};
                        }  );
                        expect(result).to.include( { name: 'New UserName'  } );
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema

                        User.findById(userID3 ,function(err, user) {
                            if (err)
                                console.log({message:"User not Found",errmsg:err});
                            else{
<<<<<<< HEAD
                                user.username="User";
                                user.email="3";
=======
                                user.name="User 3";
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema

                                user.save(function (err) {
                                    if(err) {
                                        console.log("error while updating name");
                                        done();
                                    }
                                    else
                                        done();
                                });

                            }
                        });
                    });
            });
        });

    });
    describe('Delete /users/:id',  () => {
        before(function(done){
            var tempuser= new User();
            tempuser.name="temp user";

            tempuser.save(function(err) {
                if (err)
                    console.log({message:"User not Added",errmsg:err});
                done();
            });
        });
        describe('standart Flow',  () => {
            before(function(done){
                User.find(function(err, users) {
                    if (err) {
                        console.log(err);
                        done();
                    }
                    else{
                        userID4  = users[3];
                        done();
                    }
                });



            });
            it('should delete given User', function(done) {
                chai.request(server)
                    .delete('/users/'+userID4._id)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('User Deleted' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/users/'+userID4._id)
                    .end(function(err, res) {
                        expect(res.body).to.have.property('message').equal('User not Found' );
                        done();
                    });
            });
        });
        describe('Error Flow',  () => {

            it('should display error - wrong ID', function(done) {
                chai.request(server)
                    .delete('/users/'+123)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('User not Found' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/users')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        done();
                    });
            });
        });

    });

});
