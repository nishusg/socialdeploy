var express     = require("express"),
    mongoose    = require("mongoose"),
    passport    = require("passport");
var router      = express.Router();
var User        = mongoose.model("User");
var Blog        = mongoose.model("Blog");
var Post        = mongoose.model("Post");
var Comment     = mongoose.model("Comment");
var middleware = require("../middleware");
router.get("/blog/:id/comments/new",middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("newblogcomment",{blog:blog});
    });
});
router.post("/blog/:id/comments",middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("/blog");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    res.redirect("/blog/"+blog._id);
            });
        }
    });
});

router.delete("/blog/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else{
            Comment.findByIdAndRemove(req.params.comment_id,function(err,comment){
                if(err){
                    res.redirect("back");
                }else{
                    blog.comments.pop(comment._id);
                    blog.save();
                    res.redirect("/blog/"+req.params.id);
                }
            });
        }
    });   
});

module.exports = router;