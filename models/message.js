var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
   sender:String,
   text : String,
   created:  {type: Date, default: Date.now}
});

module.exports = mongoose.model("Message", MessageSchema);