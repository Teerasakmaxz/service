var express = require('express');
var router = express.Router();
let Helper = require('../controllers/Helper')
router.post('/PreExams', async (req, res) => {
    let data = {}

    let user_id = req.body.user_id
    let lesson_id = req.body.lesson_id
    let isPreTest = await Helper.isPretestState(lesson_id, user_id)
    let typeTest = isPreTest ? 'pre' : 'post'
    let manage = await Helper.Manage(lesson_id, typeTest)
    let currentQuiz = await Helper.CurrentQuiz(user_id, lesson_id, typeTest)
    let data_lesson = await Helper.LessonState(lesson_id)
    let total_score = manage
    if (manage == 0) {
        data.status = false
        data.currentquiz = false
        data.msg = 'ขณะนี้ยังไม่มีข้อสอบ';
        res.json(data)
    }
    if (currentQuiz.length != 0) {
        data.status = true
        data.currentquiz = true
        data.msg = 'กำลังทำ';
        res.json(data)
    } else {
        data.status = true
        data.currentquiz = false
        data.lesson = data_lesson
        data.total_score = total_score
        data.msg = 'เริ่มทำ';
        res.json(data)
    }
})
