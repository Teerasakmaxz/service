var db=require('../dbconnection'); //reference of dbconnection.js
 
var Profile={
 
// getAllProfiles:function(callback){

// return db.query("SELECT tbl_profiles.id,tbl_profiles_title.prof_title,"+
// " tbl_profiles.username,tbl_profiles.email,tbl_profiles.title_id,tbl_profiles.firstname,"+
// " tbl_profiles.lastname,tbl_profiles.identification,tbl_profiles.department,tbl_profiles.division_id"+
// " FROM tbl_profiles INNER JOIN tbl_profiles ON tbl_profiles.user_id = tbl_profiles.id"+
// " INNER JOIN tbl_profiles_title ON tbl_profiles.title_id = tbl_profiles_title.prof_id  where del_status = 0",callback);
 
// },
//  getProfileById:function(id,callback){
 
// return db.query("SELECT tbl_profiles.id,tbl_profiles_title.prof_title,"+
// " tbl_profiles.username,tbl_profiles.email,tbl_profiles.title_id,tbl_profiles.firstname,"+
// " tbl_profiles.lastname,tbl_profiles.identification,tbl_profiles.department,tbl_profiles.division_id"+
// " FROM tbl_profiles INNER JOIN tbl_profiles ON tbl_profiles.user_id = tbl_profiles.id"+
// " INNER JOIN tbl_profiles_title ON tbl_profiles.title_id = tbl_profiles_title.prof_id  where tbl_profiles.del_status = 0 and tbl_profiles.id=?",[id],callback);
//  },

 addProfile:function(Profile,callback){
  console.log(Profile);
  
    var sql = "Insert into tbl_profiles("+
    "user_id,identification,title_id,firstname,lastname,sex,generation,phone,address,province,zipcode,position,company) "+
    "values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var values =[Profile.user_id,Profile.identification,Profile.title_id,Profile.firstname,Profile.lastname,Profile.sex,1,Profile.phone,Profile.address,Profile.province,Profile.zipcode,Profile.position,Profile.company]

    db.query(sql,values,function (err, result) {  
      if (err) throw err; 

      return (Profile,callback);
    });
 },

 updateProfile:function(id,Profile,callback){
    var sql = "update tbl_profiles set ";
    sql += "title_id=?,firstname=?,lastname=?,sex=?,phone=?,address=?,province=?,zipcode=?,position=?,company=? where user_id=? ";
    var values =[Profile.title_id,Profile.firstname,Profile.lastname,Profile.sex,Profile.phone,Profile.address,Profile.province,Profile.zipcode,Profile.position,Profile.company,id]
    return db.query(sql,values,callback);
//   return db.query("update tbl_category set Title=?,Status=? where Id=?",[Profile.Title,Profile.Status,id],callback);
 }
 
// deleteProfile:function(id,callback){
//     return db.query("update tbl_profiles set del_status = 1 where id=?",[id],callback);
//    },
};
 module.exports=Profile;