var express = require('express');
var router = express.Router();
var Login =require('../models/Login')
var md5 =require('md5')

router.post('/', (req,res)=>{
let passwordMD5 = md5(req.body.password)
 Login.postLogin(req.body.username,passwordMD5,(err,rows)=>{
     if (rows.length > 0) {
         res.json(rows[0].id)     
        }else{
            res.json(0)
     }
    })
})

module.exports = router;