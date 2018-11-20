var express = require('express');
 var router = express.Router();
 var Faq=require('../models/Faq');
 
router.get('/',function(req,res,next){
  Faq.getFaq(function(err,rows){
  if(err)
  {
    res.json(err);
  }
  else
  {
    res.json(rows);
  }
 });
});


 module.exports=router;