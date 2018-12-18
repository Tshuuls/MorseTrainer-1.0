
let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
<<<<<<< HEAD
        email:String,
        firebaseid:String
=======
        name: String
>>>>>>> parent of 974cac5... User schema updated user routes and tests refactored to match changes in schema
    },
    { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
