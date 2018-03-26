//  VARIABLES REQUIRED
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

//  ALL MIDDLEWARE (COMMENTS/CAMPGROUNDS OWNERSHIP & LOGGED IN)

//  CHECK: CAMPGROUND-OWNERSHIP
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found.");
            res.redirect("back");
        } else {
            // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("User authentication failed.");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "Please log in to perform action.");
        res.redirect("back");
    }
}


//  CHECK: COMMENTS-OWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Comment not found.");
            res.redirect("back");
        } else {
            // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "Must be logged in to perform action!");
        res.redirect("back");
    }
}


//  CHECK: IS-LOGGED-IN
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}


module.exports = middlewareObj;