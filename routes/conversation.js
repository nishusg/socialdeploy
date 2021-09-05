var express      = require("express"),
    mongoose     = require("mongoose"),
    router       = express.Router();
var User         = mongoose.model("User");
var Message      = mongoose.model("Message");
var Conversation = mongoose.model("Conversation");
var middleware  = require("../middleware");

router.get("/message",middleware.isLoggedIn,function(req,res){
    Conversation.find({$or:[{sender:req.user.username},{reciever:req.user.username}]},function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render("messagelist",{user:user,loginuser:req.user.username});
        }
    });
});

router.get("/message/:id",middleware.isLoggedIn,function(req,res){
    User.findOne({_id:req.params.id},function(err,user){
        if(err){
            console.log(err);
        }else{
            Conversation.findOne({sender:req.user.username,reciever:user.username}).populate("messages").exec(function(err,conversation){
                if(err){
                    console.log(err);
                }else{
                    if(conversation==null){
                        Conversation.findOne({sender:user.username,reciever:req.user.username}).populate("messages").exec(function(err,conversation){
                            if(err){
                                console.log(err);
                            }else{
                                if(conversation==null){
                                    res.render("conversation",{user:user,conversation:conversation});
                                }else{
                                    res.render("conversation",{user:user,conversation:conversation.messages});
                                }
                            }
                        })
                    }else{
                        res.render("conversation",{user:user,conversation:conversation.messages});
                    }
                }
            });
        }
    });
});

router.post("/message/:id",middleware.isLoggedIn,function(req,res){
    User.findOne({_id:req.params.id},function(err,user){
        if(err){
            console.log(err);
        }else{
            Conversation.findOne({sender:req.user.username,reciever:user.username},function(err,conversation){
                if(err){
                    console.log(err);
                }else{
                    if(conversation==null){
                        Conversation.findOne({sender:user.username,reciever:req.user.username},function(err,conversation){
                            if(err){
                                console.log(err);
                            }else{
                                if(conversation==null){
                                    var sender=req.user.username;
                                    var senderid=req.user._id;
                                    var recieverid=user._id;
                                    var reciever=user.username;
                                    var newconversation={sender:sender,senderid:senderid,recieverid:recieverid,reciever:reciever};
                                    Conversation.create(newconversation,function(err,direct){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            var sender = req.user.username;
                                            var text =req.body.text;
                                            var newmsg={sender:sender,text:text};
                                            Message.create(newmsg,function(err,msg){
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    direct.messages.push(msg);
                                                    direct.save();
                                                    user.conversations.push(direct._id);
                                                    user.save();
                                                    req.user.conversations.push(direct._id);
                                                    req.user.save();
                                                    res.redirect("/message/"+user._id);
                                                }
                                            });
                                        }
                                    })
                                }else{
                                    var sender = req.user.username;
                                    var text =req.body.text;
                                    var newmsg={sender:sender,text:text};
                                    Message.create(newmsg,function(err,mtext){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            conversation.messages.push(mtext);
                                            conversation.save();
                                            res.redirect("/message/"+user._id);
                                        }
                                    });
                                }
                            }
                        })
                    }else{
                        var sender = req.user.username;
                        var text =req.body.text;
                        var newmsg={sender:sender,text:text};
                        Message.create(newmsg,function(err,mtext){
                            if(err){
                                console.log(err);
                            }else{
                                conversation.messages.push(mtext);
                                conversation.save();
                                res.redirect("/message/"+user._id);
                            }
                        });
                    }
                }
            });
        }
    })
});


module.exports = router;