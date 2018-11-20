var db=require('../dbconnection'); //reference of dbconnection.js

let PostExams={
        countCourseScoreReady:(user_id,lesson_id,type,callback)=>{
            return db.query(`SELECT * FROM tbl_score 
            WHERE user_id = ? AND  lesson_id = ? AND type = ? AND score_past is not null AND active ='y'`,[user_id,lesson_id,type],callback)
        },
        learnLesson:(user_id,lesson_id,callback)=>{
            return db.query(`SELECT * FROM tbl_learn WHERE user_id = ? AND lesson_id = ? AND  active ='y'`,[user_id,lesson_id],callback)
        },fileCount:(lesson_id,callback)=>{
            return db.query(`SELECT COUNT(*) as filecount FROM tbl_file 
            WHERE lesson_id = ? AND active ='y'`,[lesson_id],callback)
        },filePDFCount:(lesson_id,callback)=>{
            return db.query(`SELECT COUNT(*) as filecount FROM tbl_file_pdf 
            WHERE lesson_id = ? AND active ='y'`,[lesson_id],callback)
        },CountLearnCompareTruePdf:(lesson_id,user_id,callback)=>{
            return db.query(`SELECT
            COUNT( tbl_lesson.id ) as countLearnCompareTrue
            FROM
            tbl_learn AS t
            INNER JOIN tbl_lesson ON tbl_lesson.id = t.lesson_id
            INNER JOIN tbl_file_pdf ON tbl_file_pdf.lesson_id = tbl_lesson.id
            INNER JOIN tbl_learn_file ON tbl_file_pdf.id = tbl_learn_file.file_id
            AND t.learn_id = tbl_learn_file.learn_id
            WHERE t.lesson_id=? AND t.active='y' AND tbl_learn_file.user_id_file = ? AND learn_file_status = 's'`,[lesson_id,user_id],callback)
        },countLearnCompareTrueVdos:(lesson_id,user_id,callback)=>{
            return db.query(`SELECT
            COUNT( tbl_lesson.id ) as countLearnCompareTrue
            FROM
            tbl_learn AS t
            INNER JOIN tbl_lesson ON tbl_lesson.id = t.lesson_id
            INNER JOIN tbl_file ON tbl_file.lesson_id = tbl_lesson.id
            INNER JOIN tbl_learn_file ON tbl_file.id = tbl_learn_file.file_id 
            AND t.learn_id = tbl_learn_file.learn_id
            WHERE t.lesson_id=? AND t.active='y' AND tbl_learn_file.user_id_file = ? AND learn_file_status = 's'`,[lesson_id,user_id],callback)
        },score:(user_id,lesson_id,callback)=>{
            return db.query(`SELECT
            *,MAX(score_number) AS score_number 
            FROM
            tbl_score 
            WHERE
            user_id = ? 
            AND lesson_id = ?
            AND type = 'pre' 
            AND active = 'y' 
            ORDER BY
            score_number ASC`,[user_id,lesson_id],callback)
        },countManage:(lesson_id,type,callback)=>{
            return db.query(`SELECT
            COUNT(*) as count
        FROM
            tbl_manage 
        WHERE
            id = ?
            AND type = ? 
            AND active = 'y'`,[lesson_id,type],callback)
        }
            

        
}

module.exports = PostExams
