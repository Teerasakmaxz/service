var express = require('express');
var router = express.Router();
var Contact = require('../models/Contactus')

router.post('/', (req,res)=>{
 Contact.postContact(req.body,(err,rows)=>{
     if (err) {
        res.json(0)
     } else {
        res.json(1)

     }
 })
})

router.get('/getAll/:id?',(req,res)=>{
    Contact.getContact(req.params.id,(err,rows)=>{
        if (err) {
            res.json(err)
         } else {
            res.json(rows)
    
         }
    })
})

module.exports = router