var express          = require("express"),
    mongoose         = require("mongoose"),
    passport         = require("passport");
var router           = express.Router();
var User             = mongoose.model("User");
var Friend           = mongoose.model("Friend");
var SentRequest      = mongoose.model("SentRequest");
var Post             = mongoose.model("Post");
var middleware       = require("../middleware");
router.get("/finduser",middleware.isLoggedIn,function(req,res){
    User.find({},function(err,user){
        if(err)
            console.log(err);
        else
            res.render("finduser",{user:user,status:0});
    });
});
router.post("/finduser",middleware.isLoggedIn,function(req,res){
    var user=req.body.username;
    User.find({username:user},function(err,user){
        if(err)
            console.log(err);
        else
            res.render("finduser",{user:user});
    });
    
});
router.get("/user/:userid",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.userid,function(err,user){
        if(err){
            console.log(err);
        }else{
            Post.find({name:user.username},function(err,foundPost){
                if(err){
                    console.log(err);
                }else{
                    SentRequest.findOne({rusername:user.username,susername:req.user.username},function(err,request){
                        if(err){
                            console.log(err);
                        }else{
                            if(request == null){
                                SentRequest.findOne({susername:user.username,rusername:req.user.username},function(err,request){
                                    if(request == null){
                                        if(user.username == req.user.username){
                                            res.redirect("/profile");
                                        }else{
                                            status = 0;
                                            res.render("user",{user:user,post:foundPost,status:status});
                                        }
                                    }else{
                                        if(user.username == req.user.username){
                                            res.redirect("/profile");
                                        }else if(request.susername==req.user.username && request.rusername == user.username){
                                            res.render("user",{user:user,post:foundPost,status:request.sstatus});
                                        }else if(request.susername==user.username && request.rusername == req.user.username){
                                            res.render("user",{user:user,post:foundPost,status:request.rstatus});
                                        }else{
                                            status = 0;
                                            res.render("user",{user:user,post:foundPost,status:status});
                                        }
                                    }  
                                });
                            }else{
                                if(user.username == req.user.username){
                                    res.redirect("/profile");
                                }else if(request.susername==req.user.username && request.rusername == user.username){
                                    res.render("user",{user:user,post:foundPost,status:request.sstatus});
                                }else if(request.susername==user.username && request.rusername == req.user.username){
                                    res.render("user",{user:user,post:foundPost,status:request.rstatus});
                                }else{
                                    status = 0;
                                    res.render("user",{user:user,post:foundPost,status:status});
                                }
                            }
                        }
                    })                    
                }
            });
        }
    })
})

router.post("/user/:userid",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.userid,function(err,user){
        if(err){
            console.log("err");
        }else{
            rusername = user.username;
            var request ={rusername:rusername}
            SentRequest.create(request,function(err,requestsent){
                if(err){
                    console.log(err);
                }else{
                    requestsent.sstatus = 2;
                    requestsent.rstatus = 1;
                    requestsent.susername = req.user.username;
                    requestsent.sender.id     = req.user._id;
                    requestsent.reciever.id   = user._id;
                    requestsent.save();
                    req.user.sentrequest.push(requestsent);
                    req.user.save();
                    res.redirect("/user/"+user._id);
                }
            });
        }
    })
    
});

router.get("/request",middleware.isLoggedIn,function(req,res){
    SentRequest.find({rusername:req.user.username,rstatus:1},function(err,request){
        if(err){
            console.log("err");
        }else{
            res.render("request",{request:request});
        }
    })
})

router.post("/user/:userid/cancle",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.userid,function(err,user){
        if(err){
            console.log(err);
        }else{
            SentRequest.findOneAndDelete({susername:req.user.username,rusername:user.username},function(err,request){
                if(err){
                    return console.log("err");
                }else{
                    req.user.sentrequest.pop(request._id);
                    req.user.save();
                    res.redirect("/user/"+user._id);
                }
                
            });
        }
    });
});

router.post("/user/:userid/decline",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.userid,function(err,user){
        if(err){
            console.log("err");
        }else{
            SentRequest.findOneAndDelete({susername:user.username,rusername:req.user.username},function(err,request){
                if(err){
                    return console.log("err");
                }else{
                    user.sentrequest.pop(request._id);
                    user.save();
                    res.redirect("/user/"+user._id);
                }
                
            });
        }
    });
});

router.post("/user/:userid/accept",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.userid,function(err,user){
        if(err){
            console.log("err");
        }else{
            var rstatus = 3;
            var sstatus = 3;
            var requestupdate={rstatus:rstatus,sstatus:sstatus}
            SentRequest.findOneAndUpdate({rusername:req.user.username,susername:user.username},requestupdate,function(err,request){
                if(err){
                    console.log(err);
                }else{
                    var username = request.rusername;
                    var friend   = request.susername;
                    var friendid = request.sender.id;
                    var sentrequestid=request._id;
                    var newfriend = {username:username,friend:friend,friendid:friendid,sentrequestid:sentrequestid};
                    Friend.create(newfriend,function(err,rfriend){
                        if(err){
                            console.log(err);
                        }else{
                            req.user.friends.push(rfriend);
                            req.user.save();
                            var username = request.susername;
                            var friend   = request.rusername;
                            var friendid = request.reciever.id;
                            var sentrequestid=request._id;
                            var newfriend = {username:username,friend:friend,friendid:friendid,sentrequestid:sentrequestid};
                            Friend.create(newfriend,function(err,sfriend){
                                if(err){
                                    console.log(err);
                                }else{
                                    user.friends.push(sfriend);
                                    user.save();
                                    res.redirect("/user/"+user._id);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post("/user/:userid/removefriend",middleware.isLoggedIn,function(req,res){
    User.findById(req.params.userid,function(err,user){
        if(err){
            console.log(err);
        }else{
            Friend.findOneAndDelete({username:req.user.username},function(err,sfriend){
                if(err){
                    console.log(err);
                }else{
                    req.user.friends.pop(sfriend);
                    req.user.save();
                    Friend.findOneAndDelete({username:user.username},function(err,rfriend){
                        if(err){
                            console.log(err);
                        }else{
                            user.friends.pop(rfriend._id);
                            user.save();
                            SentRequest.findByIdAndDelete(rfriend.sentrequestid,function(err,remove){
                                if(err){
                                    console.log(err);
                                }else{
                                    user.sentrequest.pop(remove._id);
                                    user.save();
                                    req.user.sentrequest.pop(remove._id);
                                    req.user.save();
                                    res.redirect("/user/"+user._id);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;