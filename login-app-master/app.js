const express = require("express");
const expressLayouts = require("express-ejs-layouts"); //initialize ejs in app.js
const mongoose = require("mongoose"); //we introduce mongoose
const flash = require("connect-flash");
const session = require("express-session");
const passport = require ("passport");


const app = express();

// Passport config
require("./config/passport") (passport);




// Database config
const db = require("./config/keys").MongoURI;

// Connect to Mongo
mongoose.connect (db, { useNewUrlParser: true})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


//EJS
//add middleware
app.use(expressLayouts);


//set view engine to ejs

app.set ("view engine", "ejs");




/*
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
*/

//Bodyparser
app.use(express.urlencoded({ extended: false}));

// Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  //Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  //connect flash middleware, to display msg in login page
  app.use(flash());

  //Global vars
  app.use((req, res, next)=>{
      res.locals.success_msg = req.flash("success_msg"); // for registration flash
      res.locals.error_msg = req.flash("error_msg");  // for registration flash
      res.locals.error = req.flash("error"); //for login flash
      next();
  });


//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`server started on port ${PORT}`));