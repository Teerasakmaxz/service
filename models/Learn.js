var db=require('../dbconnection'); //reference of dbconnection.js


var Learn = {
    getLearn :(id,callback)=>{
        db.query("SELECT file.id,file.lesson_id,file.file_name,concat('http://203.154.117.72/lms_dnp/uploads/lesson/',file.filename)as vdo FROM tbl_file as file WHERE file.active = 'y' AND file.lesson_id = ?",[id],callback);
    },
    getImage:(id,callback)=>{
        db.query("SELECT imageSlide.file_id,concat('http://203.154.117.72/lms_dnp/uploads/ppt/',id,'/slide-',imageSlide.image_slide_name,'.jpg') AS image,imageSlide.image_slide_time FROM tbl_file AS file,image_slide AS imageSlide WHERE imageSlide.file_id = file.id AND file.active = 'y' AND file.lesson_id = ?",[id],callback)
    },
    getImagePdf:(id,callback)=>{
        db.query("SELECT pdfSlide.file_id,concat('http://203.154.117.72/lms_dnp/uploads/pdf/',id,'/slide-',pdfSlide.image_slide_name,'.jpg') AS image,pdfSlide.image_slide_time FROM tbl_file_pdf AS file,pdf_slide AS pdfSlide WHERE pdfSlide.file_id = file.id AND file.active = 'y' AND file.lesson_id = ?",[id],callback)
    },
    getType: (id, callback) => {
        return db.query("select type from tbl_lesson where active ='y' and id=?",
        [id], callback)
    },
    getLearnId:(id,user_id, callback)=>{
        return db.query("select learn_id from tbl_learn where active ='y' and lesson_id =? and user_id=? ",
        [id,user_id], callback)
    },
    getCourseId:(lesson_id,callback)=>{
        return db.query("select course_id from tbl_lesson where id =? ",
        [lesson_id], callback)
    },
    getLastSlide:(learn_id,file_id,user_id, callback)=>{
        return db.query("select learn_file_status from tbl_learn_file where learn_id =? and file_id =? and user_id_file=? ",
        [learn_id,file_id,user_id], callback)
    },
    checkLearnfile: (learn_id,user_id,file_id,callback)=>{
        return db.query("select learn_file_id from tbl_learn_file where learn_id =? and user_id_file=? and file_id=?",
        [learn_id,user_id,file_id], callback)
    },
    addLearn:function(lesson_id,user_id,course_id,callback){
        var sql_learn = "Insert into tbl_learn("+
        "lesson_id,user_id,course_id,learn_date,create_date) "+
        "values(?,?,?,now(),now())";
        var values_learn =[lesson_id,user_id,course_id];
   
       return  db.query(sql_learn,values_learn,callback);
    },
    addLearnfile:function(learn_id,user_id,file_id,status,callback){

        var sql_learn_file = "Insert into tbl_learn_file("+
        "learn_id,user_id_file,file_id,learn_file_date,learn_file_status) "+
        "values(?,?,?,now(),?)";
        var values_learn_file =[learn_id,user_id,file_id,status];
        return  db.query(sql_learn_file,values_learn_file,callback);
    },
    updateLearnfile:function(learn_id,user_id,file_id,status,callback){
        var sql_learn_file = "Update tbl_learn_file "+
        "set learn_file_status=? "+
        "where learn_id=? and user_id_file=? and file_id=? ";
        var values_learn_file =[status,learn_id,user_id,file_id];
       return  db.query(sql_learn_file,values_learn_file,callback);
    },
    count_learn_file_all:function(lesson_id,callback){
        var sql_learn_file = "select count(*) as count_file "+
        "from tbl_file "+
        "where lesson_id=? ";
        var values_learn_file =[lesson_id];
       return  db.query(sql_learn_file,values_learn_file,callback);
    },
    count_learn_file_success:function(learn_id,user_id,file_id,callback){
        var sql_learn_file = "select count(*) as count_file "+
        "from tbl_learn_file "+
        "where learn_id=? and user_id_file=? and file_id=? and learn_file_status='s'";
        var values_learn_file =[learn_id,user_id,file_id];
       return  db.query(sql_learn_file,values_learn_file,callback);
    },
    update_learn_status:function(learn_id,learn_status,callback){
        var sql_learn = "Update tbl_learn "+
        "set lesson_status=? "+
        "where learn_id=?";
        var values_learn =[learn_status,learn_id];
       return  db.query(sql_learn,values_learn,callback);
    },
}
module.exports = Learn