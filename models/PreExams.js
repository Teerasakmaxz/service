var db = require('../dbconnection'); //reference of dbconnection.js
var PreExams = {

    checkHavePreTestInManage: (lesson_id, type, callback) => {
        return db.query(`SELECT * FROM tbl_manage as manage JOIN tbl_grouptesting as grouptesting 
                ON grouptesting.group_id =manage.group_id  WHERE id = ? AND type = ?
                AND manage.active='y' AND grouptesting.active ='y'`, [lesson_id, type], callback);

    },
    haveScore: (user_id, lesson_id, callback) => {
        return db.query(`SELECT * FROM tbl_score WHERE user_id =? AND lesson_id =?  AND active ='y'`, [user_id, lesson_id], callback)
    },
    manage: (lesson_id, testType, callback) => {
        return db.query(`SELECT * FROM tbl_manage WHERE id = ? AND type = ? AND active ='y'`, [lesson_id, testType], callback)
    },
    lesson: (lesson_id, callback) => {
        return db.query(`SELECT * FROM tbl_lesson WHERE id = ? AND active ='y'`, [lesson_id], callback)
    },
    currentQuiz: (user_id, lesson, type, callback) => {
        return db.query(`SELECT * FROM temp_quiz 
        WHERE user_id =? AND lesson =? AND type =?  ORDER BY id`, [user_id, lesson, type], callback)

    },
    testamount: (user_id, lesson_id, type, callback) => {
        return db.query(`SELECT * FROM tbl_test_amount WHERE lesson_id = ? AND user_id = ? AND active ='y' AND type = ?`, [lesson_id, user_id, type], callback)
    },
    score: (user_id, lesson_id, type, callback) => {
        return db.query(`SELECT * FROM tbl_score WHERE lesson_id = ? AND user_id = ? AND active ='y' AND type = ?`, [lesson_id, user_id, type], callback)
    },
    score1: (user_id, lesson_id, type, callback) => {
        return db.query(`SELECT * FROM tbl_score WHERE score_past='y' AND lesson_id = ? AND user_id = ? AND active ='y' AND type = ?`, [lesson_id, user_id, type], callback)
    },
    tempQuiz: (user_id, lesson, sql_number, type, callback) => {

        return db.query(`SELECT * FROM temp_quiz 
            WHERE user_id =? AND lesson =? AND type=? ${sql_number} ORDER BY id`, [user_id, lesson, type], callback)
    },
    updateQuestion_type: (choice, user_id, lesson, ques_id, type, callback) => {        
        return db.query(`UPDATE temp_quiz SET status = 1,ans_id= ? WHERE user_id = ? AND lesson = ? AND ques_id =? AND type =?`, [choice, user_id, lesson, ques_id, type], callback)
    },
    saveScore: (modelCoursescore, callback) => {                
        return db.query(`INSERT INTO tbl_score (manage_id,lesson_id,user_id,type,create_date,create_by,update_date,update_by,score_count,active,course_id)
            VALUES (?,?,?,?,NOW(),?,NOW(),?,?,'y',?)`, [
            modelCoursescore.manage_id,
            modelCoursescore.lesson_id,
            modelCoursescore.user_id,
            modelCoursescore.type,
            modelCoursescore.user_id,
            modelCoursescore.user_id,
            modelCoursescore.score_count,
            modelCoursescore.course_id
        ], callback)
    },
    temp_accept: (user_id, lesson_id, type, manage_id, callback) => {
        
        return db.query(`SELECT * FROM temp_quiz JOIN tbl_question ON temp_quiz.ques_id = tbl_question.ques_id WHERE user_id=? AND lesson =? AND type=? AND manage_id =?`,[user_id, lesson_id, type, manage_id], callback)
    },
    modelCoursescore: (user_id, lesson_id, manage_id, callback) => {        
        return db.query(`SELECT * FROM tbl_score WHERE user_id=? AND lesson_id =? AND manage_id =? AND score_past is null AND active='y'`,[user_id, lesson_id, manage_id], callback)
    },
    coursequestion: (ques_id, callback) => {
        return db.query(`SELECT * FROM tbl_question INNER JOIN tbl_choice WHERE tbl_question.ques_id=?`, [ques_id], callback)
    },
    coursequestionChoice: (ques_id) => {
        return db.query(`SELECT * FROM tbl_choice WHERE ques_id =? AND choice_answer=1`, [ques_id], callback)
    },
    saveLogChoice: (model, callback) => {
        val = [
            model.lesson_id,
            model.logchoice_select,
            model.score_id,
            model.choice_id,
            model.ques_id,
            model.user_id,
            model.is_valid_choice,
            model.logchoice_answer,
            model.user_idCreate,
            model.user_idUpdate
        ]
        return db.query(`INSERT INTO  tbl_logchoice (lesson_id,logchoice_select,score_id,choice_id,ques_id,user_id,ques_type,
                is_valid_choice,logchoice_answer,create_date,create_by,update_date,update_by,active)
            VALUES(?,?,?,?,?,?,?,?,NOW(),?,NOW(),?,'y')`, val, callback)
    },
    saveLogQues: (data, callback) => {
        val = [
            data.lesson_id,
            data.score_id,
            data.ques_id,
            data.user_id,
            data.test_type,
            data.ques_type,
            data.result,
            data.user_idCreate,
            data.user_idUpdate
        ]
        return db.query(`INSERT INTO  tbl_logques (lesson_id,score_id,ques_id,user_id,test_type,ques_type,result,create_date,create_by,update_date,update_by,active)
            VALUES(?,?,?,?,?,?,?,NOW(),?,NOW(),?,'y')`, val, callback)

    },
    choiceQues: (data) => {
        return db.query(`SELECT * FROM tbl_choice WHERE choice_id =? AND reference IS NOT NULL`, [data], callback)
    },
    modelscore: (score_total, score_number, score_id, callback) => {
        return db.query(`UPDATE tbl_score SET score_number = ?, score_total = ?,update_date = NOW() WHERE score_id =?`, [score_total, score_number, score_id], callback)
    },
    modelscore1: (score_past, score_id, callback) => {
        return db.query(`UPDATE tbl_score SET score_past = ? WHERE score_id =?`, [score_past, score_id], callback)
    },
    learnModel: (lesson_id, user_id, callback) => {
        return db.query(`SELECT * FROM tbl_learn WHERE lesson_id= ?AND user_id= ? AND active ='y'`, [lesson_id, user_id], callback)
    },
    selectScore: (id, callback) => {
        return db.query(`SELECT * FROM tbl_score where score_id=?`, [id], callback)
    },
    lessonAll: (course_id, callback) => {
        return db.query(`SELECT * FROM tbl_lesson WHERE course_id= ? AND active ='y'`, [course_id], callback)
    },
    lessonAllCount: (course_id, callback) => {
        return db.query(`SELECT COUNT(*) FROM tbl_lesson WHERE course_id= ? AND active ='y'`, [course_id], callback)
    },
    lesson_new: (lesson_id, user_id, type, callback) => {
        return db.query(`SELECT COUNT(*) FROM tbl_test_amount WHERE lesson_id =? AND user_id =? AND type = ?`, [lesson_id, user_id, type], callback)
    },
    countScorePast: (lesson_id, user_id, type, callback) => {
        return db.query(`SELECT COUNT(*) FROM tbl_score WHERE lesson_id=? AND user_id =? AND type =? AND active = 'y'`, [lesson_id, user_id, type], callback)
    },
    isExamAddToCourseForTest: (course_id, callback) => {
        return db.query(`SELECT * FROM	tbl_coursemanage as manage INNER JOIN tbl_coursegrouptesting as grouptest ON manage.group_id = grouptest.group_id WHERE manage.id =? AND type = 'course' AND manage.active='y' AND grouptest.active ='y'`, [course_id], callback)
    },
    passCoursModel: (passcours_cates, user_id, callback) => {
        return db.query(`SELECT * FROM tbl_passcours WHERE passcours_cates =? AND passcours_user=?`, [passcours_cates, user_id], callback)
    },
    count_no_select: (user_id, lesson, type, callback) => {
        return db.query(`SELECT COUNT(*) as count FROM temp_quiz WHERE user_id=? AND lesson=? AND type=? AND status='0' order by id`, [user_id, lesson, type], callback)
    },
    deleteTemp: (user_id, lesson_id, type, callback) => {
        console.log(`DELETE FROM temp_quiz WHERE user_id =${user_id} AND lesson =${lesson_id} AND type =${type}`);
        
        return db.query(`DELETE FROM temp_quiz WHERE user_id =? AND lesson =? AND type =?
        `, [user_id, lesson_id, type], callback)
    },
    INSERTpassCoursModel: (modelPasscours) => {
        let val = [
            modelPasscours.passcours_cates,
            modelPasscours.passcours_cours,
            modelPasscours.passcours_user,
        ]
        db.query(`INSERT INTO tbl_passcours (passcours_cates,passcours_cours,passcours_user,passcours_date)
        VALUES (?,?,?,NOW())`, val, callback)
    },
    INSERTpostscore: () => {
        return db.query(`INSERT INTO tbl_score (lesson_id,user_id,type,score_number,score_total,score_past,course_id,manage_id,score_count)
        VALUES()`)
    },
    saveLearn_file: (learnFile, callback) => {
        let val = [
            learnFile.learn_id,
            learnFile.user_id_file,
            learnFile.file_id,
            learnFile.learn_file_date,
            learnFile.learn_file_status
        ]
        return db.query(`INSERT INTO tbl_learn_file (learn_id,user_id_file,file_id,learn_file_date,learn_file_status) VALUES(?,?,?,NOW(),?)`, val, callback)
    },
    saveLearnLog: (learnLog, callback) => {
        let val = [
            learnLog.user_id,
            learnLog.lesson_id,
            learnLog.course_id,
            learnLog.lesson_status,
            learnLog.learn_date,
        ]
        return db.query(`INSERT INTO tbl_learn (user_id,lesson_id,course_id,lesson_status,learn_date) VALUES(?,?,?,?,NOW())`, val, callback)
    },
    learnModelUpdate: (lesson_id, user_id, callback) => {
        return db.query(`UPDATE tbl_learn SET lesson_status='passtest'`, [lesson_id, user_id], callback)
    },
    saveScore1: (postscore, callback) => {
        return db.query(`INSERT INTO tbl_score (lesson_id,user_id,type,score_number,score_total,score_past,course_id,manage_id,create_date,create_by,update_date,update_by,score_count,active)
            VALUES (?,?,?,?,?,?,?,?,NOW(),?,NOW(),?,?)`, [
            postscore.lesson_id,
            postscore.user_id,
            postscore.type,
            postscore.user_id,
            postscore.user_id,
            postscore.score_count,
            'y'
        ], callback)
    },

};
module.exports = PreExams;