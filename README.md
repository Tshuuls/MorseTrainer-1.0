# Assignment 1 - API testing and Source Control.

Name: Julia Zeckl

## Overview.

The Morse Trainer is a Webapp designed to help the user learn Morsecode. A user can create a course and choose how many randomized entries are in the course. The users and courses are stored in a mongoDB using MLab. The project is tested using UnitTests with Mocha and Chai.

## API endpoints.

 Course
 + GET /courses - List all courses
 + GET /courses/:id - list course with specific id
 + GET /courses/transformation/:id - list course with coursecontent transformed from ids to morse objects
 + POST /courses - Add new course
 + PUT /courses/:id - Update score of specific course
 + DELETE /courses/:id - Delete course by id

 User
 + GET /users - List all users
 + GET /users/:id - List user with specific id
 + GET /users/courselist/:id - list all courses of a specific user
 + GET /users/score/:id - return added up score of all courses from a user
 + GET /users/filter/:filter - filter user by name (firstname + last name)
 + POST /users - Add new user
 + PUT /users/:id - Update name of specific user
 + DELETE /users/:id - Delete user by id



## Data storage.
The data is stored using mLab.
The two stored collections are:
Users
        {
            "_id": {
                "$oid": "5be012905c46870b564f09c1"
            },
            "firstname": "Test",
            "lastname": "User1",
            "__v": 0
        }
Courses
        {
            "_id": {
                "$oid": "5be012905c46870b564f09c2"
            },
            "score": 5,
            "coursecontent": [
                7,
                13,
                21
            ],
            "coursetype": "morse",
            "userId": {
                "$oid": "5be012905c46870b564f09c1"
            },
            "__v": 0
        }
## Sample Test execution.
        npm test

        > morsetrainer-1.0@0.0.0 test /Users/julia/Desktop/NextCloud/WebApp/Server/MorseTrainer-1.0
        > NODE_ENV=test mocha tests/users-test.js mocha tests/courses-test.js

        Warning: Could not find any test files matching pattern: mocha


        (node:2963) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
          Users
        Successfully Connected to [ testmorsedb ]
        Successfully Connected to [ testmorsedb ]
        Successfully Connected to [ testmorsedb ]
        Successfully Connected to [ testmorsedb ]
        { message: 'User Added!', userID: 5be015452978e20b936d04a1 }
        { message: 'User Added!', userID: 5be015452978e20b936d04a2 }
        { message: 'User Added!', userID: 5be015452978e20b936d04a3 }
        { message: 'Course Added!', courseID: 5be015452978e20b936d04a4 }
        { message: 'Course Added!', courseID: 5be015452978e20b936d04a5 }
            GET /users
              ✓ should return all the users in an array (50ms)
            GET /users:id
              ✓ should return one user
              ✓ should return an error - wrong userID
            GET /users/courselist/:id
              ✓ should return all courses of one user
              ✓ should return an error - no courses found
              ✓ should return an error - wrong userID
            GET /users/score/:id
              ✓ should return full score of one user
              ✓ should return an error - wrong userID
              ✓ should return an error - no courses found
            GET /users/filter/:filter
              ✓ should return users with test in their name
              ✓ should return an error - no users with tom
            Post /users
              Error Flow
                ✓ should return Error - no name giver
              Standart Flow
                ✓ should add User
        (node:2963) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
            Put /users/:id
              Error Flow
                ✓ should return Error - no name given
                ✓ should return Error - wrong ID
                ✓ should return Error - new name same as old name
              Standart Flow
                ✓ should change username
            Delete /users/:id
              standart Flow
                ✓ should delete given User
              Error Flow
                ✓ should display error - wrong ID

          Courses
        { message: 'User Added!', userID: 5be015462978e20b936d04a8 }
        { message: 'Course Added!', courseID: 5be015462978e20b936d04a9 }
        { message: 'Course Added!', courseID: 5be015462978e20b936d04aa }
            GET /courses
              ✓ should return all the courses in an array
            GET /courses/:id
              ✓ should return all the courses in an array
              ✓ should return an error
            GET /courses/transformation/:id
              ✓ should return all the courses in an array
              ✓ should return an error
            POST /courses
              Error Flow wrong parameter
                ✓ should return Error
              Error Flow wrong courstype
                ✓ should return Error
              Standart Flow
                ✓ should add new course
            PUT /courses/:id
              Error flow
                ✓ should return an error - wrong parameter
                ✓ should return an error - cours not found
                ✓ should return an error - same score
              Standart flow
                ✓ should update score of given course
            Delete /courses/:id
              standart Flow
                ✓ should delete given Course
              Error Flow
                ✓ should display error - wrong userID


          33 passing (859ms)



## Extra features.
