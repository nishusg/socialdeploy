var express     = require("express"),
    mongoose    = require("mongoose"),
    passport    = require("passport");
var router      = express.Router();
var User        = mongoose.model("User");
var Post        = mongoose.model("Post");
var middleware = require("../middleware");
//auth routes
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var image = "https://semantic-ui.com/images/wireframe/image.png";
    req.body.username
    req.body.password
    req.body.email
    User.register(new User({username : req.body.username,email : req.body.email,image:image}),req.body.password,function(err,user){
        if(err){
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Colleague "+user.username);
            res.redirect("/profile");
        });
    });
});

//login
router.get("/login",function(req,res){
    res.render("login");
});


router.post("/login",passport.authenticate("local" , {
    successRedirect : "/profile",
    failureRedirect : "/login"
}),function(req,res){

});

//logout
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

module.exports = router;