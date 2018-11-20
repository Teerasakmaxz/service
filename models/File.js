var db=require('../dbconnection'); //reference of dbconnection.js

var file = {

    getFileTest :(idLesson,callback)=>{
        db.query("SELECT id,lesson_id,file_name,concat('http://203.154.117.72/lms_dnp/uploads/filedoc/',filename) as filename,length,file_position,create_date,create_by,update_date,update_by,active  FROM tbl_file_doc WHERE lesson_id = ? AND active = 'y'",[idLesson],callback);
    }
}
module.exports = file