var express = require('express');
var router = express.Router();
var User = require('../models/User');
let Helper =require('../controllers/Helper')
var nodemailer = require('nodemailer');

router.get('/:id?', function (req, res, next) {
  if (req.params.id) {
    User.getUserById(req.params.id, function (err, rows) {
      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else {
    User.getAllUsers(function (err, rows) {
      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

router.post('/forgot_password', function (req, res, next) {
  User.findByEmail(req.body.email,async function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      let data = {}
      if(rows.length == 0){
        data.status = false;
        data.msg = "ไม่พบข้อมูล";
      }else{
        let url = "http://203.154.117.72/lms_dnp/forgot_password/Checkpassword?activkey="+rows[0].activkey+"&id="+rows[0].id;
        let email = req.body.email;
        let message = '<center><div style="height:150px;width:400px;background-color: #2FDC86;padding-top: 50px">'+
        '<h3>เพื่อทำการเปลี่ยนรหัสผ่านใหม่ โปรดลิกลิ้งก์ด้านล่าง</h3>'+
        '<br/><a style="background-color: #1BB225;color: white;margin-top:25px;padding: 14px 25px;text-align: center;'+
        'text-decoration: none;display: inline-block;" href="'+url+'">เปลี่ยนรหัสผ่านใหม่</a></div></center>';
        /// send mail
        
        var mailOptions = {
          from: 'e.learning.dnp@gmail.com',
          to: email,
          subject: 'เปลี่ยนรหัสผ่านใหม่',
          html: message
        };
        
        data = await function_sendMail(mailOptions);
      }
      console.log(data);
      //// end send mail
      res.json(data); //or return count for 1 &amp;amp;amp; 0
    }
  });

});

router.get('/province/province',(req,res)=>{
  User.province((err,rows)=>{
    res.json(rows)
  })
})

router.post('/register', function (req, res, next) {

  User.addUser(req.body, function (err, User) {
    
    console.log("=====================User========================")
    console.log(User);
    if (err) {
      res.json(err);
    } else {
      let url = "http://203.154.117.72/lms_dnp/user/activation/activation?activkey="+User.activkey+"&email="+req.body.email;
      let email = req.body.email;
      var pass = req.body.identification.substring(7, 14);
      let message = '<br><label>สวัสดีคุณ :  '+req.body.email+'</label><br><br>'+
           '<b><label>ขอขอบคุณสำหรับการเข้าร่วมเป็นสมาชิกของ ระบบการเรียนการสอนผ่านออนไลน์ กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช</label></b>'+
            '<br><br><label for="">Username และ Password ของท่านคือ</label><br><br><label for="">Username :</label>'+
            '<a>'+req.body.identification+'<br><br><label for="">Password :</label>'+pass+'<br><br></a>'+
        'Please activate you account go to '+ url ;
      /// send mail
      
      var mailOptions = {
        from: 'e.learning.dnp@gmail.com',
        to: email,
        subject: 'สมัครสมาชิกสำเร็จ',
        html: message
      };
      console.log("========================activkey================");
      console.log(User.activkey);
      console.log("=====================url========================")
      console.log(url);
      function_sendMail(mailOptions);

      res.json(req.body); //or return count for 1 &amp;amp;amp; 0
    }
  });
});
router.delete('/:id', function (req, res, next) {
  User.deleteUser(req.params.id, function (err, count) {

    if (err) {
      res.json(err);
    } else {
      res.json(count);
    }

  });
});
router.put('/:id', function (req, res, next) {
  User.updateUser(req.params.id, req.body, function (err, rows) {

    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

function function_sendMail(mailOptions){
  return new Promise((resolve, reject) => {
      try {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'e.learning.dnp@gmail.com',
            pass: 'dnp@2018'
          }
        });

        transporter.sendMail(mailOptions, function(error, info){
          let data = {};
          if (error) {
            data.status = false;
            data.msg = "ไม่สามารถส่งลิ้งสำหรับเปลี่ยนรหัสผ่านได้";
            resolve(data);
          } else {
            data.status = true;
            data.msg = "ระบบได้ส่งลิ้งสำหรับเปลี่ยนหรัสผ่าน โปรดตรวจสอบในกล่องจดหมาย";
            console.log('Email sent: ' + info.response);
            resolve(data);
          }
        });
      } catch (err) {
      reject(new Error('Oops!'));
      }
  });
}
module.exports = router;