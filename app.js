const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const PORT = 3000;
const routeI = require("./routes/index");
const routeU = require("./routes/users");
const mongoose = require('mongoose');
const db = require('./config/key').MongoURI;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport'); 

app = express();

//Passport config
require('./config/passport')(passport);

//DB Config
mongoose.connect(db,{ useNewUrlParser: true })
  .then(()=>console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');


//bodyparser
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/',routeI);
app.use("/users",routeU);

app.listen(PORT,()=>{
  console.log(`Server listening on ${PORT}`);
});


