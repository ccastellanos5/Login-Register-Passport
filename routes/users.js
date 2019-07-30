const express = require("express");
const router = express.Router();
const byscript = require('bcryptjs');
const passport = require('passport');

//User model

const User = require('../models/User');

//login page
router.get("/login", (req, res) => {
  res.render("login");
});


//register page
router.get("/register",(req,res)=>{
  res.render("register");
});

//Register Handle

router.post('/register', (req,res)=>{
  const { name, email, password, password2 } = req.body;
  let errors = [];
  
  if(!name || !email || !password || !password2 ){
    errors.push({ msg: 'Please fill in all fields'});
  }

  if(password !== password2){
    errors.push({ msg: "Password do not match"});
  }

  if(password.length < 6){
    errors.push({ msg:'Password should be at least 6 characteres' });
  }

  if(errors.length > 0){
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else{
    User.findOne({ email: email})
      .then(user => {
        if(user)
        {
          errors.push({ msg: 'Email is already exist'});
          
          res.render('register',{
          errors,
          name,
          email,
          password,
          password2
         });
        }
        else
        {
          const newUser = new User({
            name,
            email,
            password
          });
          
          byscript.genSalt(10, (err, salt) => {
            byscript.hash(newUser.password, salt, (err, hash)=>{
              if(err) throw err;

              newUser.password = hash;

              newUser.save()
                .then( user => {
                  req.flash('success_msg', 'You are now registered. You can log in');
                  res.redirect('./login');
                })
                .catch(err =>console.log(err));
            });
          });
        }
      })
      .catch();
  }
});

//Login Handle

router.post('/login',(req, res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//logout Handle
router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success_msg', 'You are log out');
  res.redirect('/users/login')
})
module.exports = router;