var db=require('../dbconnection'); //reference of dbconnection.js
var Faq={
 
getFaq:function(callback){
return db.query("SELECT cms_faq.faq_nid_,cms_faq.faq_THtopic,cms_faq.faq_THanswer,cms_faq.faq_type_id,cms_faq.faq_hideStatus,cms_faq_type.faq_type_title_TH,cms_faq.active FROM cms_faq INNER JOIN cms_faq_type ON cms_faq.faq_type_id = cms_faq_type.faq_type_id where cms_faq.active = 'y'",callback);
 
},

// updateAbout:function(About,callback){
//   return db.query("update tbl_about set about_title=?,about_detail=? where active=?",[About.about_title,About.about_detail,'y'],callback);
//  },
 
// deleteAbout:function(id,callback){
//     return db.query("update tbl_about set del_status = 1 where id=?",[id],callback);
//    },
};
 module.exports=Faq;