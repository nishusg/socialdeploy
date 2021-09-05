var mongoose = require("mongoose");

var ConversationSchema = new mongoose.Schema({
   sender: String,
   senderid:String,
   recieverid:String,
   reciever : String,
   messages:[
      {
         type : mongoose.Schema.Types.ObjectId,
         ref  : "Message"
      }
   ]
});

module.exports = mongoose.model("Conversation", ConversationSchema);