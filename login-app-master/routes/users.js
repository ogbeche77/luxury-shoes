const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //encryting password
const passport = require("passport");


// User model
const User = require("../models/User");



//login Page
router.get("/login", (req, res)=> res.render("Login"));


//Register Page
router.get("/register", (req, res)=> res.render("register"));

// Register Handle
router.post("/register",(req, res)=>{
    const {name, email, password, password2} = req.body;
    let errors = [];

    //validations
    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: "Please fill in required fields, "});
    }

    //check password match
    if(password !== password2){
        errors.push({msg: "Password didn't match"});
    }

    //check pass length
    if(password.length < 6){
        errors.push({msg: "Password should be than 6 characters"});
    }

    if(errors.length > 0){
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {

        // This validation checks to see if a user had an existing account 
        //calling method on user
        User.findOne({ email: email })
        .then(user => {
                if(user) {
                errors.push({msg: "Email already in use" });
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
        }   else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                // encrypt password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;

                    // Password set to hash
                    newUser.password = hash;

                    // Saving user account
                    newUser.save()
                    .then(user => {
                        //passing in the flash msg when we redirect to login page, already initialize on app.js
                        req.flash("success_msg", "You are registered and can now login");
                        res.redirect("/users/login"); //if user account is setup successful, it redirects to login page
                    })
                    .catch(err => console.log(err));


                }) )
        }
               
        });

    }
});

// Login Handle
router.post ("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    }) (req, res, next);
});

//Logout Handle functionality from dashboard page, redirects to login page
router.get("/logout", (req, res)=>{
req.logout();
req.flash("success_msg", "You are now logged out");
res.redirect ("/users/login");
});


module.exports = router;