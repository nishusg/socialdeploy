var mongoose = require("mongoose");

var FriendSchema = new mongoose.Schema({
    username : String,
    friend   : String,
    friendid:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User"
    },
    sentrequestid:{
        type : mongoose.Schema.Types.ObjectId,
        ref  : "SentRequest"
    }    

});

module.exports = mongoose.model("Friend", FriendSchema);