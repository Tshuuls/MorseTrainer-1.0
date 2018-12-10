# Assignment 2 - Web API - Automated development process.

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

## Continuous Integration and Test results.
Travis:
https://travis-ci.com/Tshuuls/MorseTrainer-1.0
Coveralls:
https://coveralls.io/github/Tshuuls/MorseTrainer-1.0


## Extra features.
-
