var db=require('../dbconnection'); //reference of dbconnection.js
var Usability={
 
getUsability:function(callback){
return db.query("SELECT * FROM tbl_usability where active = 'y'",callback);
 
},
getUsabilityForId:(id,callback)=>{
    return db.query("SELECT * FROM tbl_usability where active = 'y' AND usa_id = ?",[id],callback)
}
// updateAbout:function(About,callback){
//   return db.query("update tbl_about set about_title=?,about_detail=? where active=?",[About.about_title,About.about_detail,'y'],callback);
//  },
 
// deleteAbout:function(id,callback){
//     return db.query("update tbl_about set del_status = 1 where id=?",[id],callback);
//    },
};
 module.exports=Usability;