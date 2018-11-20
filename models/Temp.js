var db = require('../dbconnection'); //reference of dbconnection.js
var Temp = {

    tempAll: (user_id, lesson_id, type, callbak) => {
        return db.query(`SELECT * FROM temp_quiz 
        WHERE user_id = ? AND lesson = ? AND type =?`, [user_id, lesson_id, type], callbak)
    },
    countTempAll: (user_id, lesson_id, type, callbak) => {
        return db.query(`SELECT COUNT(*) as count FROM temp_quiz 
        WHERE user_id = ? AND lesson = ? AND type =?`, [user_id, lesson_id, type], callbak)
    }, 
    currentQuizNumber: (user_id, lesson, type, number, callbak) => {
        return db.query(`SELECT *  FROM temp_quiz WHERE user_id= ? AND lesson= ? AND type=? AND number=? order by id`, [user_id, lesson, type, number], callbak)
    }

}
module.exports = Temp