var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//  ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


//  SHOW REGISTER FORM ROUTE
router.get("/register", function(req, res){
    res.render("register");
});


//  HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // SIGN-UP HANDLER SOLUTION 2
            return res.render("register", {"error": err.message});
            
         // SIGN-UP HANDLER SOLUTION 1
            // req.flash("error", err.message);
            // return res.render("register");
        };
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});


//  LOGIN FORM ROUTE
router.get("/login", function(req, res) {
    res.render("login");
});


//  HANDLE LOGIN LOGIC
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res) {
});


//  LOG-OUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully Logged You Out");
    res.redirect("/campgrounds");
});


//Module Export
module.exports = router;