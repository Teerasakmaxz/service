var mysql=require('mysql');
 var connection=mysql.createPool({
 
host:'203.154.117.72',
 user:'db_dnp',
 password:'dnp_2018',
 database:'db_dnp',
 timezone:'utc'
 
});
 module.exports=connection;