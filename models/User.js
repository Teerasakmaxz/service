let db=require('../dbconnection'); //reference of dbconnection.js
let md5 = require('md5'); 
let Profile=require('../models/Profile');
let User={
 
getAllUsers:function(callback){

return db.query("SELECT tbl_users.id,tbl_profiles_title.prof_title,"+
" tbl_users.username,tbl_users.email,tbl_profiles.title_id,tbl_profiles.firstname,tbl_profiles.phone,"+
" concat('http://1111111111/lms_dnp/uploads/user/',tbl_users.id,'/original/',tbl_users.pic_user) as pic_user,"+

" tbl_profiles.lastname,tbl_profiles.identification,tbl_profiles.department,tbl_users.division_id,tbl_users.repass_status"+
" FROM tbl_users INNER JOIN tbl_profiles ON tbl_profiles.user_id = tbl_users.id"+
" INNER JOIN tbl_profiles_title ON tbl_profiles.title_id = tbl_profiles_title.prof_id  where del_status != 1 and tbl.users.status = 1",callback);
 
},
 getUserById:function(id,callback){
return db.query("SELECT tbl_users.id,tbl_profiles_title.prof_title,"+
" tbl_users.username,tbl_users.email,tbl_profiles.title_id,tbl_profiles.firstname,tbl_profiles.phone,"+
" concat('http://111111111111/lms_dnp/uploads/user/',tbl_users.id,'/original/',tbl_users.pic_user) as pic_user,"+

" tbl_profiles.lastname,tbl_profiles.identification,tbl_profiles.department,tbl_users.division_id,tbl_users.repass_status"+
" FROM tbl_users INNER JOIN tbl_profiles ON tbl_profiles.user_id = tbl_users.id"+
" INNER JOIN tbl_profiles_title ON tbl_profiles.title_id = tbl_profiles_title.prof_id  where tbl_users.del_status != 1 and tbl_users.id=?",[id],callback);
 },

 addUser:function(User,callback){
     let sql_user = "Insert into tbl_users("+
     "username,password,email,activkey,status,division_id,repass_status) "+
     "values(?,?,?,?,?,?,?)";
     let time = process.hrtime()[0]+''+process.hrtime()[1];
     User.activkey = md5(time+User.identification);
     var res = User.identification.substring(7, 14);
     let values_user =[User.identification,md5(res),User.email,User.activkey,0,User.division_id,0];

    db.query(sql_user,values_user, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
        //upload file
        User.user_id = result.insertId;
        if (User.title_id == 1) {
            User.sex = "Male";
        }else
        {
            User.sex = "Female";
        }

    return Profile.addProfile(User,callback);
    });
 },

 updateUser:function(id,User,callback){
    let sql_user = "update tbl_users set";
    sql_user += " email=?,division_id=? where id=? ";
    let values_user =[User.email,User.division_id,User.id];
    db.query(sql_user,values_user, function (err, result) {
        if (err) throw err;
        if (User.title_id == 1) {
            User.sex = "Male";
        }else
        {
            User.sex = "Female";
        }

        // Profile.addProfile(User,callback);
    return Profile.updateProfile(id,User,callback);
    });
 },
 
deleteUser:function(id,callback){
    return db.query("update tbl_users set del_status = 1 where id=?",[id],callback);
   },
findByEmail:function(email,callback){
    return db.query("SELECT tbl_users.id,tbl_users.activkey,tbl_profiles_title.prof_title,"+
    " tbl_users.username,tbl_users.email,tbl_profiles.title_id,tbl_profiles.firstname,tbl_profiles.phone,"+
    " concat('http://203.154.117.72/lms_dnp/uploads/user/',tbl_users.id,'/original/',tbl_users.pic_user) as pic_user,"+
    " tbl_profiles.lastname,tbl_profiles.identification,tbl_profiles.department,tbl_users.division_id,tbl_users.repass_status"+
    " FROM tbl_users INNER JOIN tbl_profiles ON tbl_profiles.user_id = tbl_users.id"+
    " INNER JOIN tbl_profiles_title ON tbl_profiles.title_id = tbl_profiles_title.prof_id  where tbl_users.del_status != 1 and tbl_users.email = ?",[email],callback);
   },province:(callback)=>{
       return db.query(`SELECT * FROM tbl_province`,callback)
   }
};
 module.exports=User;