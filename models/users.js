
let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
        email:String,
        firebaseid:String
    },
    { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
