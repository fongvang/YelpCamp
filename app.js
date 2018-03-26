//  VARIABLES CONFIG
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds.js"),
    Comment     = require("./models/comment"),
    methodOverride  = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    flash       = require("connect-flash"),
    
    Campground = require("./models/campground");


//  REQUIRING ROUTES
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");


//  MONGOOSE CONFIG
mongoose.connect("mongodb://localhost/yelp_camp_v12");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  //manually seed the database!


//  PASSPORT CONFIG
app.use(require("express-session")({
    secret: "I am still the best person in the world!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//  REFACTORED & APPENDED ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



//----------------------Listener PORT & IP--------------------------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Has Started...")
});