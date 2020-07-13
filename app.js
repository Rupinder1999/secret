require("dotenv").config();
const express = require("express");
const bodyParser=require("body-parser");
const ejs =require("ejs");
const mongoose=require("mongoose");
var session = require('express-session');
const passport=require("passport");
const passportlocalmongoose=require("passport-local-mongoose");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({
    secret:"rupindersinghissingh",
    resave:false, 
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
mongoose.set('useCreateIndex',true);
const userSchema= new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(passportlocalmongoose);
const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/",function(req,res)
{
    res.render("home");
});
app.get("/secrets",function(req,res)
{
    if(req.isAuthenticated())
    res.render("secrets")
    else
    res.redirect("/login");
})
app.get("/register",function(req,res)
{
    res.render("register");
});
app.post("/register",function(req,res)
{

    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err)
        {
        console.log("register error");
        res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function()
            {
                console.log(req);
                res.redirect("/secrets");
            })

        }
    })
})
app.get("/login",function(req,res)
{
    res.render("login");
});

app.post("/login",function(req,res)
{

    const newuser= new User({
        username:req.body.username,
        password:req.body.password
    });
    // passport method
    req.login(newuser,function(err)
    {
        if(err)
        {
            console.log("login error");
        }
        else{
            passport.authenticate("local")(req,res,function()
            {
                  res.render("secrets");
            });
        }
    })
    
})

app.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/");
})



app.listen(3000,function(){
    console.log("Online");
})