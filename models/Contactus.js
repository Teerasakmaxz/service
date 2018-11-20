var db = require('../dbconnection');
let Contact = {
    postContact: (value,callback) => {
        let sql = "insert into tbl_contactus"+
        "(contac_by_name,contac_by_surname,contac_by_email,contac_by_tel,"+
        "contac_subject,contac_detail,contac_type,contac_ans_subject,contac_ans_detail,contac_answer,"+
        "create_by,create_date,update_by,update_date,active,contac_course) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

        let valueContact = [value.name,value.surname,value.email,value.tel,value.subject,
            value.detail,value.type,value.ansSubject,value.ansDetail,value.answer,
            value.createBy,value.createDate,value.updateBy,
            value.updateDate,value.active,value.contac_course]
            return db.query(sql,valueContact,callback);
    },
    getContact:(id ,callback) =>{
        return db.query("SELECT * FROM tbl_contactus WHERE active ='y' AND create_by = ? ORDER By contac_id DESC",[id],callback);
    }
};
module.exports = Contact;