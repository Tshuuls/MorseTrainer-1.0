
let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        name: String
    },
    { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);