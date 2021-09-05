var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
   name: String,
   title: String,
   image: String,
   description: String,
   created:  {type: Date, default: Date.now},
   comments:[
      {
         type : mongoose.Schema.Types.ObjectId,
         ref  : "Comment"
      }
   ],
   user :{
      id:{
         type : mongoose.Schema.Types.ObjectId,
         ref  : "User"
      },
      username : String
  }
});

module.exports = mongoose.model("Post", PostSchema);