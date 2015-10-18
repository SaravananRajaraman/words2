/**
 * Created by HP on 9/5/2015.
 */
// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var usersSchema   = new mongoose.Schema({
    username: { type: String, lowercase: true },
    email: { type : String , unique : true, required : true },
    password: String
});

// Export the Mongoose model
module.exports = mongoose.model('users', usersSchema);
