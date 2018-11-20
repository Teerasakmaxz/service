var db=require('../dbconnection'); //reference of dbconnection.js
 
var Category={
 
getAllCategorys:function(callback){

return db.query("SELECT tbl_category.cate_id, tbl_category.cate_type,tbl_category.cate_title,tbl_category.cate_short_detail,tbl_category.cate_detail,tbl_category.create_date,concat('http://203.154.117.72/lms_dnp/uploads/category/',tbl_category.cate_id,'/thumb/',tbl_category.cate_image) as cate_image,tbl_category.cate_show,tbl_category.create_by,tbl_category.update_date,tbl_category.update_by,tbl_category.active,tbl_category.special_category FROM tbl_category WHERE tbl_category.active = 'y' AND tbl_category.cate_show = 1",callback);
 
},
 getCategoryById:function(id,callback){
 
return db.query("SELECT tbl_category.cate_id, tbl_category.cate_type,tbl_category.cate_title,tbl_category.cate_short_detail,tbl_category.cate_detail,tbl_category.create_date,concat('http://203.154.117.72/lms_dnp/uploads/category/',tbl_category.cate_id,'/thumb/',tbl_category.cate_image) as cate_image,tbl_category.cate_show,tbl_category.create_by,tbl_category.update_date,tbl_category.update_by,tbl_category.active,tbl_category.special_category FROM tbl_category WHERE tbl_category.active = 'y' AND tbl_category.cate_show = 1 and cate_id=?",[id],callback);
 },

//  addCategory:function(Category,callback){
//  return db.query("Insert into tbl_category(course_type"+
//     ", course_number, cate_id, course_title,course_lecturer,course_short_title,course_detail,"+
//     "course_point,course_price,course_picture) values(?,?,?)",[Category.Id,Category.Title,Category.Status],callback);
//  },

//  deleteCategory:function(id,callback){
//   return db.query("delete from tbl_category where Id=?",[id],callback);
//  },
//  updateCategory:function(id,Category,callback){
//   return db.query("update tbl_category set Title=?,Status=? where Id=?",[Category.Title,Category.Status,id],callback);
//  }
 
};
 module.exports=Category;