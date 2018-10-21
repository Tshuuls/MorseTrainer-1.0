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

    mongodbUri ='mongodb://User1:testUser1@ds137643.mlab.com:37643/testmorsedb';

//mongoose.connect('mongodb://localhost:27017/morsedb');
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

/*var cat = null;
var invoice = null;*/
var userID="5bcc7c1a078bcd01249cec60";
var courseID1="5bcc88768574d7028aac9502";
var courseID2="5bcc8896a5014c029002dc0d";
var courseID3=null;

describe('Courses', function (){


    describe('GET /courses',  () => {
        it('should return all the courses in an array', function(done) {
            chai.request(server)
                .get('/courses')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
    });

    describe('GET /courses/:id',  () => {

        it('should return all the courses in an array', function(done) {

            let uri='/courses/'+courseID1;
            chai.request(server)
                .get(uri)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    let result = _.map(res.body, (course) => {
                        return { coursetype: course.coursetype}
                    });
                    expect(result).to.include( { coursetype: "morse"} );

                    done();
                });
        });
        it('should return an error', function(done) {

            let uri='/courses/123';
            chai.request(server)
                .get(uri)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    expect(res.body).to.have.property('message').equal('Course not Found' );

                    done();
                });
        });
    });
    describe('GET /courses/transformation/:id',  () => {

        it('should return all the courses in an array', function(done) {

            let uri='/courses/transformation/'+courseID1;
            chai.request(server)
                .get(uri)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    expect(res.body.coursecontent.length).to.equal(3);
                    expect(res.body.coursecontent).to.include( { "id": 13,
                        "morse": "--",
                        "letter": "M"} );

                    done();
                });
        });
        it('should return an error', function(done) {

            let uri='/courses/transformation/123';
            chai.request(server)
                .get(uri)
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    expect(res.body).to.have.property('message').equal('Course not Found' );

                    done();
                });
        });
    });

    describe('POST /courses',  () => {
        describe('Error Flow wrong parameter',  () => {
            it('should return Error', function(done) {
                let course = {
                    courssetype: 'letter' ,
                    userId: userID,
                    length: 1
                };
                let uri='/courses';
                chai.request(server)
                    .post(uri)
                    .send(course)
                    .end((err, res) => {
                        expect(res).to.have.status(404);

                        expect(res.body).to.have.property('error').equal('No userId and/or coursetype and/or length parameter given, could not add course' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/courses')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);

                        done();
                    });
            });
        });
        describe('Error Flow wrong courstype',  () => {
            it('should return Error', function(done) {
                let course = {
                    coursetype: 'nonsense' ,
                    userId: userID,
                    length: 1
                };
                let uri='/courses';
                chai.request(server)
                    .post(uri)
                    .send(course)
                    .end((err, res) => {
                        expect(res).to.have.status(404);

                        expect(res.body).to.have.property('error').equal('Wrong CourseType given, could not add course' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/courses')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);

                        done();
                    });
            });
        });
        describe('Standart Flow',  () => {
            it('should add new course', function(done) {
                let course = {
                    coursetype: 'letter' ,
                    userId: userID,
                    length: 1
                };
                let uri='/courses';
                chai.request(server)
                    .post(uri)
                    .send(course)
                    .end((err, res) => {
                        expect(res).to.have.status(200);

                        expect(res.body).to.have.property('message').equal('Course Added!' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/courses')
                    .end(function(err, res) {
                        let result = _.map(res.body, (course) => {
                            return { coursetype: course.coursetype,
                                userId: course.userId};
                        }  );
                        expect(result).to.include( { coursetype: 'letter', userId: userID  } );

                        var tempid  = res.body.filter(function(obj){
                            if (obj._id !== courseID1 && obj._id !== courseID2) {
                                return obj ;
                            }

                        } );

                        Course.findByIdAndRemove(tempid, function(err) {
                            if (err)
                                console.log({message:"Course not Deleted",errmsg:err});
                            else
                                done();
                        });
                        ;
                    });
            });
        });

    });
    describe('PUT /courses/:id',  () => {
        describe('Error flow',  () => {
            it('should return an error - wrong parameter', function(done) {
                let score = {
                    scorre: 10
                };
                let uri='/courses/'+courseID1;
                chai.request(server)
                    .put(uri)
                    .send(score)
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('error').equal('Score Not Updated - No Score parameter given' );

                        done();
                    });
            });
            it('should return an error - cours not found', function(done) {
                let score = {
                    score: 10
                };
                let uri='/courses/123';
                chai.request(server)
                    .put(uri)
                    .send(score)
                    .end((err, res) => {
                        expect(res).to.have.status(200);

                        expect(res.body).to.have.property('message').equal('Course not Found' );

                        done();
                    });
            });
            it('should return an error - same score', function(done) {
                let score = {
                    score: 0
                };
                let uri='/courses/'+courseID1;
                chai.request(server)
                    .put(uri)
                    .send(score)
                    .end((err, res) => {
                        expect(res).to.have.status(404);

                        expect(res.body).to.have.property('error').equal('Score Not Updated - new score same as old score' );

                        done();
                    });
            });
        });
        describe('Standart flow',  () => {
            it('should update score of given course', function(done) {
                let score = {
                    score: 10
                };
                let uri='/courses/'+courseID1;
                chai.request(server)
                    .put(uri)
                    .send(score)
                    .end((err, res) => {
                        expect(res).to.have.status(200);

                        expect(res.body).to.have.property('message').equal('Score Updated' );

                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/courses/'+courseID1)
                    .end(function(err, res) {
                        let result = _.map(res.body, (course) => {
                            return { score: course.score};
                        }  );
                        expect(result).to.include( { score: 10  } );
                        Course.findById(courseID1 ,function(err, course) {
                            if (err)
                                console.log({message:"Course not Found",errmsg:err});
                            else{
                                course.score=0;

                                course.save(function (err) {
                                    if(err) {
                                        console.log("error while updating score");
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

    describe('Delete /courses/:id',  () => {
        before(function(done){
            var tempcourse= new Course();
            tempcourse.coursetype="letter";
            tempcourse.userId=userID;
            tempcourse.score=0;
            tempcourse.coursecontent=[
                17
            ];

            tempcourse.save(function(err) {
                if (err)
                    console.log({message:"Course not Added",errmsg:err});
                done();

            });



        });
        describe('standart Flow',  () => {
            before(function(done){

                Course.find(function(err, courses) {
                    if (err) {
                        res.send(err);
                        done();
                    }
                    else{
                        courseID3  = courses[2];
                        done();
                    }
                });



            });
            it('should delete given Course', function(done) {
                chai.request(server)
                    .delete('/courses/'+courseID3.id)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Course Deleted' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/courses/'+courseID3.id)
                    .end(function(err, res) {
                        expect(res.body).to.have.property('message').equal('Course not Found' );
                        done();
                    });
            });
        });
        describe('Error Flow',  () => {

            it('should display error - wrong userID', function(done) {
                chai.request(server)
                    .delete('/courses/'+123)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Course not Deleted' );
                        done();
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/courses')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);
                        done();
                    });
            });
        });

    });
});