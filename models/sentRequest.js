var mongoose = require("mongoose");

var RequestSchema = new mongoose.Schema({
    sstatus : Number,
    rstatus : Number,
    susername : String,
    rusername : String,
    sender : {
        id:{
           type : mongoose.Schema.Types.ObjectId,
           ref  : "User"
        }
    },
    reciever : {
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref  : "User"
         }
    }
});

module.exports = mongoose.model("SentRequest", RequestSchema);