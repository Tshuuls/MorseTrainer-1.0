
let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        firstname: String,
        lastname:String
    },
    { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);