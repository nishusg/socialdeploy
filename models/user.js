var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String,unique:true,required : true},
    password: String,
    email: {type: String,unique:true,required : true},
    name: String,
    image: String,
    bio: String,
    website: String,
    friends:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Friend"
        }
    ],
    conversations:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Conversation"
        }
    ],
    sentrequest:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "SentRequest"
        }
    ],
    blogs:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Blog"
        }
    ],
    posts :[{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Post"
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);