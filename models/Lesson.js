var db = require('../dbconnection'); //reference of dbconnection.js

var Lesson = {
 getLessonForCourseID:(id, callback) => {
        return db.query(`SELECT
        tbl_lesson.id,
        tbl_lesson.course_id,
        tbl_lesson.title,
        tbl_lesson.description,
        tbl_lesson.content,
        tbl_lesson.cate_amount,
        tbl_lesson.cate_percent,
        tbl_lesson.header_id ,
        tbl_lesson.time_test,
        concat('http://203.154.117.72/lms_dnp/uploads/lesson/', tbl_lesson.id, '/thumb/', tbl_lesson.image ) AS image,
        tbl_lesson.create_date,
        tbl_lesson.create_by,
        tbl_lesson.update_date,
        tbl_lesson.update_by,
        tbl_lesson.active,
        tbl_lesson.view_all,
        tbl_lesson.lesson_no
    FROM
        tbl_lesson
    WHERE
        tbl_lesson.active = 'y' AND tbl_lesson.course_id =?
    ORDER BY
        lesson_no`,
        [id], callback)
    },

    getLessonByID: (id, callback) => {
        return db.query("select id,course_id,title,description,content,cate_amount,cate_percent,header_id" +
                ",time_test,concat('http://203.154.117.72/lms_dnp/uploads/lesson/',id,'/thumb/',im" +
                "age) as image,create_date,create_by,update_date,update_by,active,view_all,status" +
                ",lesson_no from tbl_lesson where active ='y' and id=?",
        [id], callback)
    },
    getPreTest: (idLesson, callback) => {

        return db.query("SELECT COUNT(*) as pre FROM tbl_manage as manage,tbl_grouptesting as grouptestin" +
                "g WHERE manage.group_id = grouptesting.group_id AND  type = 'pre' AND manage.act" +
                "ive='y' AND grouptesting.active ='y' AND grouptesting.lesson_id = ?",
        [idLesson], callback);
    },
    getPostTest: (idLesson, callback) => {

        return db.query("SELECT COUNT(*) as post FROM tbl_manage as manage,tbl_grouptesting as grouptesti" +
                "ng WHERE manage.group_id = grouptesting.group_id AND  type = 'post' AND manage.a" +
                "ctive='y' AND grouptesting.active ='y' AND grouptesting.lesson_id =?",
        [idLesson], callback);
    },
    checkscore:(lesson_id,type,user_id,callback)=>{
        return db.query("SELECT COUNT(*) as count_score FROM tbl_score " +
                " WHERE lesson_id=? and type=? and user_id=? and active='y'",
        [lesson_id,type,user_id], callback);
    },
    getFileAll: (idLesson, callback) => {
        return db.query("SELECT id,lesson_id,file_name,concat('http://203.154.117.72/lms_dnp/uploads/filed" +
                "oc/',filename) as filepath,length,file_position,create_date,create_by,update_dat" +
                "e,update_by,active  FROM tbl_file_doc WHERE lesson_id = ? AND active = 'y' order by file_position",
        [idLesson], callback);
    },
    gettotalscore:(lesson_id,type,callback)=>{
        return db.query("select sum(manage_row) as totalscore from tbl_manage where id = ? and type = ? and active = 'y'",
        [lesson_id,type], callback);
    },
    gettotaltime:(lesson_id,callback)=>{
        return db.query("select time_test from tbl_lesson where id = ? and active = 'y'",
        [lesson_id], callback);
    },
    getLearnStatus:(lesson_id,user_id,callback)=>{
        return db.query("select * from tbl_learn where lesson_id = ? and user_id=?  and active = 'y' order by learn_id desc",
        [lesson_id,user_id], callback);
    },
    getPreTestScore:(lesson_id,user_id,callback)=>{
        return db.query("select * from tbl_score where lesson_id = ? and user_id=? and type='pre' and active = 'y' order by score_number desc",
        [lesson_id,user_id], callback);
    },
    getPostTestScore:(lesson_id,user_id,callback)=>{
        return db.query("select * from tbl_score where lesson_id = ? and user_id=? and type='post' and active = 'y' order by score_number desc",
        [lesson_id,user_id], callback);
    },
    checkTemp:(lesson_id,type,user_id,callback)=>{
        return db.query("select * from temp_quiz where lesson = ? and type=? and user_id=? ",
        [lesson_id,type,user_id], callback);
    },
    getManage:(lesson_id,type,callback)=>{
        return db.query("select * from tbl_manage where id = ? and type=? and active ='y' ",
        [lesson_id,type], callback);
    },
    getLimitQuestion:(group_id,manage_row,callback)=>{
        return db.query("select * from tbl_question where group_id = ? and active='y' ORDER BY RAND() limit ? ",
        [group_id,manage_row], callback);
    },
    getchoice:(ques_id,callback)=>{
        return db.query("select * from tbl_choice where ques_id = ? and active='y' ",
        [ques_id], callback);
    },
    createTemp:(temp_test,callback)=>{  
        if(temp_test.time_start != null){
            val = [
                temp_test.user_id,
                temp_test.type,
                temp_test.lesson,
                temp_test.group_id,
                temp_test.ques_id,
                temp_test.number,
                temp_test.status,
                temp_test.question,
                temp_test.time_up,
                temp_test.manage_id
            ];
            return db.query("insert into temp_quiz("+
            "user_id,type,lesson,group_id,ques_id,number,status,time_start,question,time_up,manage_id) "+
            "values (?,?,?,?,?,?,?,NOW(),?,?,?) ",
            val, callback);
        }else{
            val = [
                temp_test.user_id,
                temp_test.type,
                temp_test.lesson,
                temp_test.group_id,
                temp_test.ques_id,
                temp_test.number,
                temp_test.status,
                temp_test.question,
                temp_test.manage_id
            ];

            
            // console.log("nsert into temp_quiz("+
            // "user_id,type,lesson,group_id,ques_id,number,`status`,question,manage_id) "+
            // "values ("+temp_test.user_id+","+temp_test.type+","+temp_test.lesson+","+temp_test.group_id+","+temp_test.ques_id+","+
            // temp_test.number+","+temp_test.status+","+temp_test.question+","+temp_test.manage_id+")");
            return db.query("insert into temp_quiz("+
            "user_id,type,lesson,group_id,ques_id,number,`status`,question,manage_id) "+
            "values (?,?,?,?,?,?,?,?,?) ",
            val, callback); 
        }
    },
    getCurrentQuiz:(user_id,lesson_id,type,sql_number,callback)=>{
        return db.query("select * from temp_quiz "+
        "where user_id=? and lesson=? and type=? ? ",
        [user_id,lesson_id,type,sql_number], callback);
    },
    getQuestionById:(ques_id,callback)=>{
        return db.query("select * from tbl_question "+
        "where ques_id=? and active='y' ",
        [ques_id], callback);
    },
    getTempAll:(user_id,lesson_id,type,callback)=>{
        return db.query("select * from temp_quiz "+
        "where user_id=? and lesson=? and type=? ",
        [user_id,lesson_id,type], callback);
    }
}

module.exports = Lesson;
