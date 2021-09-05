var express     = require("express"),
    mongoose    = require("mongoose"),
    passport    = require("passport");
var router      = express.Router();
var User        = mongoose.model("User");
var Post        = mongoose.model("Post");
var middleware = require("../middleware");
router.get("/profile",middleware.isLoggedIn,function(req,res){
    User.findOne({username : req.user.username},function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render("profile",{user : user});
        }
    });
});
router.get("/editprofile",middleware.isLoggedIn,function(req,res){
    User.findOne({username : req.user.username},function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render("editprofile",{user : user});
        }
    })
});

module.exports = router;
