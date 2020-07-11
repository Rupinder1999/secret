require("dotenv").config();
const express = require("express");
const bodyParser=require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
const userSchema= new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/register",function(req,res)
{
    
    res.render("register");
})
app.post("/register",function(req,res)
{
    const newuser= new User({
        email:req.body.username,
        password:req.body.password
    })
    newuser.save(function(err){
        if(err)
        console.log("save error");
        else{
            console.log("goos");
            res.render("secrets");
        }
    })
})
app.get("/login",function(req,res)
{
    res.render("login");
});
app.post("/login",function(req,res)
{
    usernamedb=req.body.username;
    passworddb=req.body.password;

  User.findOne({email:usernamedb},function(err,result){
      if(err)
      console.log("find error");
      else{
          if(result.password===passworddb)
          {
              res.render("secrets");
          }
      }

  })
})














app.listen(3000,function(){
    console.log("Online");
})