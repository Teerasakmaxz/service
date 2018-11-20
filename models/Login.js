var db=require('../dbconnection'); //reference of dbconnection.js

var Login = {
postLogin:function(username,password,callback){
return db.query("SELECT * FROM tbl_users where username = ? and password = ?",[username,password],callback);
 }
};
 module.exports=Login;