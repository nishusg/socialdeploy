var express     = require("express"),
    mongoose    = require("mongoose"),
    passport    = require("passport");
var router      = express.Router();
var User        = mongoose.model("User");
var Post        = mongoose.model("Post");
var Comment     = mongoose.model("Comment");
var middleware = require("../middleware");
router.get("/post/:id/comments/new",middleware.isLoggedIn,function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(err)
            console.log(err);
        else
        res.render("newcomment",{post:post});
    });
});
router.post("/post/:id/comments",middleware.isLoggedIn,function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(err){
            console.log(err);
            res.redirect("/post");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    res.redirect("/post/"+post._id);
            });
        }
    });
});

router.get("/post/:id/comments/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("editcomment",{post_id:req.params.id,comment:foundComment});
        }
    });
});

router.put("/post/:id/comments/:comment_id",middleware.checkCommentOwner,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/home");
        }
    })
});

router.delete("/post/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(err){
            console.log(err);
        }else{
            Comment.findByIdAndRemove(req.params.comment_id,function(err,comment){
                if(err){
                    res.redirect("back");
                }else{
                    post.comments.pop(comment._id);
                    post.save();
                    res.redirect("/post/"+req.params.id);
                }
            });
        }
    });   
});

module.exports = router;