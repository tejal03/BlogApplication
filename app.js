var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose = require('mongoose'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require('method-override');


//mongoose.connect("mongodb://localhost/restful_blog_app");
//Add mlab user credential link
mongoose.connect("mongodb:// ** add your credentials");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine","ejs");


//Mongoose model config
var blogSchema = mongoose.Schema({
   name:String,
   image: String,
   body: String,
   created: 
        {type: Date, default: Date.now()} 
});

var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//   name: "Test dog",
//   image: "https://www.centralnewyorkinjurylawyer.com/files/2017/03/dog.jpg",
//   body: "Hello This is a blog post."
// },function(err,blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(blog);
//     }
// });
//RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
          if(err){
             console.log(err);
         }else{
             res.render("index",{blogs:blogs});
        }  
    })
   
});

//NEW Route
app.get("/blogs/new",function(req,res){
    res.render("new");
    
});

//CREATE Route
app.post("/blogs",function(req,res){
    //create a blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log("Error Occured");
            console.log(err);
        }else{
            res.redirect('/blogs');
        }
    })
    // res.render("new");
});

//SHOW Route
app.get("/blogs/:id",function(req,res){
    
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           console.log(err);
       } else{
           res.render("show",{blog:foundBlog});
           //console.log(foundBlog);
       }
    });
  // res.send("Show page");
    
});

//EDIT Route
app.get("/blogs/:id/edit",function(req,res){
    
    Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          console.log(err);
      } else{
          res.render("edit",{blog:foundBlog});
          //console.log(foundBlog);
      }
    });
  // res.send("Edit page");
    
});

//UPDATE Route
app.put("/blogs/:id",function(req,res){
     //update a blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs/"+req.params.id);
         }
    });
     
});

app.delete("/blogs/:id",function(req,res){
   
   Blog.findByIdAndRemove(req.params.id,req.body.blog,function(err,foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs");
         }
    });
});

app.listen(process.env.PORT, process.env.IP,function(){
   console.log("Server has started!!!") 
});
