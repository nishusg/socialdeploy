var mongoose = require("mongoose");

var BlogSchema = new mongoose.Schema({
   name: String,
   text : String,
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

module.exports = mongoose.model("Blog", BlogSchema);