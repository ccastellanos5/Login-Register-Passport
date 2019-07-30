const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Card = require('../models/Card');


router.get("/", (req,res)=>{
  res.render("welcome");
});

router.get('/dashboard',ensureAuthenticated, (req,res)=>{
  Card.find({ author: req.user._id})
  .then(cards => {
    res.render('dashboard', { 
      user: req.user,
      cards
    })
  })
  .catch(err => console.log(err));
  
});

//create a note
router.post('/dashboard',ensureAuthenticated, (req,res)=>{
  const { title, body } = req.body;
  let errors = []
  
  if(!title || !body ){
    errors.push({ msg: 'Please fill in all fields'});
  }

  if(errors.length > 0){
    res.render('dashboard',{
      errors,
      title,
      body
    });
  }
  else{
    const NewCard = new Card({
      title: title,
      body: body,
      author: req.user.id 
    })
  
    NewCard.save();
    res.redirect('dashboard');
  }

});

//delete a note
router.get('/delete/:id', (req, res) => {

  Card.deleteOne({ _id: req.params.id})
  .then(data => {
    req.flash('success_msg', 'The note was deleted successfully, mmg');
    res.redirect('/dashboard');
  })
  .catch(err => console.log(err));
});


//update a note
router.post('/edit', (req, res)=>{
  const {idinput, title, body } = req.body;

  Card.findById({_id: idinput})
  .then( card => {
    card.title = title;
    card.body = body;
    console.log('card nuevas',card)
    card.save()
    res.redirect('/dashboard');
  })
  .catch(err => console.log(err));

});

module.exports = router;