var db=require('../dbconnection'); //reference of dbconnection.js

var preTest = {

    getPreTest :(idLesson,callback)=>{
        
        db.query("SELECT COUNT(*) as pre FROM tbl_manage as manage,tbl_grouptesting as grouptesting WHERE manage.group_id = grouptesting.group_id AND  type = 'pre' AND manage.active='y' AND grouptesting.active ='y' AND grouptesting.lesson_id = ?",[idLesson],callback);
    }
}

module.exports = preTest