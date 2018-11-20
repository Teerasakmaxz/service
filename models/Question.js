var db=require('../dbconnection'); //reference of dbconnection.js
var Question={

    question:(group_id,manage_row,callbak)=>{
        return db.query(`SELECT * FROM tbl_question 
        WHERE group_id = ? AND active = 'y' ORDER BY rand() limit ?`,[group_id,manage_row],callbak)
    },getTempData:(group_id,callbak)=>{
        return db.query(`SELECT * FROM tbl_question 
        WHERE ques_id = ? AND active = 'y'`,[group_id],callbak)
    }

}
module.exports = Question