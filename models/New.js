var db=require('../dbconnection'); //reference of dbconnection.js
 
var New={
 
getAllNews:function(callback){

return db.query("Select cms_id,cms_title,cms_short_title,cms_detail,cms_link,concat('http://203.154.117.72/lms_dnp/uploads/news/',cms_id,'/thumb/',cms_picture) as cms_picture,create_date,create_by,update_date,update_by,active,cms_type_display from tbl_news where active ='y'",callback);
 
},
 getNewById:function(id,callback){
 
return db.query("select cms_id,cms_title,cms_short_title,cms_detail,cms_link,concat('http://203.154.117.72/lms_dnp/uploads/news/',cms_id,'/thumb/',cms_picture) as cms_picture,create_date,create_by,update_date,update_by,active,cms_type_display from tbl_news where cms_id=?",[id],callback);
 },

//  addNew:function(New,callback){
//  return db.query("Insert into tbl_news(course_type"+
//     ", course_number, cate_id, course_title,course_lecturer,course_short_title,course_detail,"+
//     "course_point,course_price,course_picture) values(?,?,?)",[New.Id,New.Title,New.Status],callback);
//  },

//  deleteNew:function(id,callback){
//   return db.query("delete from tbl_news where Id=?",[id],callback);
//  },
//  updateNew:function(id,New,callback){
//   return db.query("update tbl_news set Title=?,Status=? where Id=?",[New.Title,New.Status,id],callback);
//  }
 
};
 module.exports=New;