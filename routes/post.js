var express     = require("express"),
    mongoose    = require("mongoose"),
    path        = require("path"),
    crypto      = require("crypto"),
    mongoose    = require("mongoose"),
    multer      = require('multer');
var {GridFsStorage} = require("multer-gridfs-storage"),
    Grid        = require("gridfs-stream"),
    passport    = require("passport");
var router      = express.Router();
var User        = mongoose.model("User");
var Post        = mongoose.model("Post");
var middleware  = require("../middleware");

var mongoURI = "mongodb+srv://nishu:nishu@gallery.wfxdb.mongodb.net/social?retryWrites=true&w=majority";
var conn = mongoose.createConnection(mongoURI,{ useUnifiedTopology: true , useNewUrlParser: true });
let gfs;
conn.once('open', () =>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
})

var storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file)=>{
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return console.log("err");
          }
          var filename = buf.toString('hex') + path.extname(file.originalname);
          var fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
});
var upload = multer({ storage });




router.get("/explore",middleware.isLoggedIn,function(req,res){
    Post.find({},function(err,posts){
        if(err)
            console.log(err);
        else{
            res.render("findpost",{post:posts});
        } 
    }).sort({ created: 'desc' });
});

router.get("/mypost",middleware.isLoggedIn,function(req,res){
    Post.find({name:req.user.username},function(err,posts){
        if(err){
            console.log(err);
        }else{
            res.render("mypost",{post:posts});
        }
    })
});

router.get("/:id/post",middleware.isLoggedIn,function(req,res){
    User.findOne({_id:req.params.id},function(err,user){
        if(err){
            console.log(err);
        }else{
            Post.find({name:user.username},function(err,posts){
                if(err){
                    console.log(err);
                }else{
                    res.render("userpost",{post:posts,name:user.username});
                }
            });
        }
    });

});

router.get("/post",middleware.isLoggedIn,function(req,res){
    res.render("post");
});
router.post("/post",middleware.isLoggedIn,upload.single("image"),function(req,res){
    User.findOne({username:req.user.username},function(err,user){
        if(err){
            console.log(err);
        }else{
            if(err){
                console.log(err);
            }else{
                var title = req.body.title;
                var image = req.file.filename;
                var desc  = req.body.description;
                var newpost = {title:title,image:image,description:desc};
                Post.create(newpost,function(err,post){
                    if(err)
                        console.log(err);
                    else
                        post.user.id=req.user._id;
                        post.user.username=req.user.username;
                        post.name=req.user.username;
                        post.save();
                        user.posts.push(post);
                        user.save();
                        res.redirect("/profile");     
                });
            }
        }
    });
});
router.get("/post/:postid",middleware.isLoggedIn,function(req,res){
    Post.findOne({_id:req.params.postid}).populate("comments").exec(function(err,foundPost){
        if(err)
            console.log("err");
        else{
            res.render("showpost",{post:foundPost});
        }
    });
});



router.get("/post/:id/edit",middleware.checkPostOwner,function(req,res){
    Post.findById(req.params.id,function(err,foundPost){
        if(err)
            console.log("err");
        else{
            res.render("editpost",{post:foundPost});
        }
    });
});

router.put("/post/:id",middleware.checkPostOwner,function(req,res){
    var data={title:req.body.title,description:req.body.description};
    Post.findByIdAndUpdate(req.params.id,data,function(err){
        if(err)
            res.redirect("/post");
        else
            res.redirect("/post/"+req.params.id);
    });
});

router.delete("/post/:id",middleware.checkPostOwner,function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err,post){
        if(err)
            res.redirect("/profile");
        else
            gfs.remove({filename:post.image,root:'uploads'},function(err){
                if(err){
                    console.log(err);
                }else{
                    req.user.posts.pop(post._id);
                    req.user.save();
                    res.redirect("/profile");
                }
            })
            
    });
});

router.post("/editprofile",middleware.isLoggedIn,upload.single("image"),function(req,res){
    if(req.file == undefined ){
        var name = req.body.name;
        var bio  = req.body.bio;
        var website = req.body.website;
        var newpr = { name:name,bio:bio,website:website};
    }else{
        var name = req.body.name;
        var image = req.file.filename;
        var bio  = req.body.bio;
        var website = req.body.website;
        var newpr = { name:name,image:image,bio:bio,website:website};
    }
    User.findByIdAndUpdate({_id : req.user._id},newpr,function(err,user){
        if(err){
            console.log(err);
        }else{
            res.redirect("/profile");
        }
    });
});
router.get("/image/:id",function(req,res){
    gfs.files.findOne({filename:req.params.id},function(err,image){
        if(err){
            console.log(err);
        }else{
            var readstream = gfs.createReadStream(image.filename);
            readstream.pipe(res);
        }
    })
})
module.exports = router;