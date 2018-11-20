var db=require('../dbconnection'); //reference of dbconnection.js
    var Video = {
        getVideo :(id,callback) =>{
            return db.query("SELECT * FROM tbl_file WHERE lesson_id = ? AND active = 'y'",[id],callback)

        },
        getVideoAll :(callback) =>{
            return db.query("SELECT vdo_id,vdo_title,vdo_path as link_path,concat('http://203.154.117.72/lms_dnp/admin/uploads/',vdo_path" +
            ") as vdo_path,vdo_type,create_date,create_by,update_date,update_by,active,vdo_thumbnail FROM tbl_vdo WHERE active = 'y' order by vdo_id desc",callback)

        }
    }
    
module.exports = Video;
