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


router.post('/index', async (req, res) => {
    let data = {}
    let lessonStatus
    let user_id = req.body.user_id
    let lesson_id = req.body.lesson_id
    let actionEvnt = req.body.actionEvnt
    let idx_now = req.body.idx_now
    let choice = req.body.Choice
    let question_type = req.body.Question_type
    let dropdownVal = req.body.dropdownVal
    let lesson = await Helper.Lesson(lesson_id)
    let isPreTest = await Helper.isPretestState(lesson_id, user_id)
    let typeTest = isPreTest ? 'pre' : 'post'
    let countCourseScoreReady = await Helper.CountCourseScoreReady(user_id, lesson, typeTest)

    if (lesson) {
        lessonStatus = await Helper.CheckLessonPass(lesson, lesson_id, user_id)
    }
    if (lessonStatus == 'pass' || typeTest) {
        let countScore = await Helper.func_getscore(user_id, lesson_id, 'post')
        let countManage = await Helper.CountManage(lesson_id, typeTest)
        if (countManage[0]["count"] <= 0) {
            data.status = false
            data.msg = "ขณะนี้ยังไม่มีข้อสอบ"
            res.json(data)
        }
        if (countScore == lesson[0].cate_amount) {
            const countScorePast = await Helper.func_getscore(user_id, lesson_id, typeTest)
            if (countScorePast.length > 0) {
                data.status = false
                data.msg = "คุณสอบผ่านแล้ว"
                res.json(data)
            } else {
                data.status = false
                data.msg = "คุณสอบไม่ผ่าน หมดสิทธิ์ทำแบบทดสอบ"
                res.json(data)
            }
        } else {
            const countScorePast = await Helper.func_getscore1(user_id, lesson_id, typeTest)
            if (countScorePast.length > 0) {
                data.status = false
                data.msg = "คุณสอบผ่านแล้ว"
                res.json(data)
            } else {
                let scorePercent = lesson[0].cate_percent
                let manage = await Helper.getManage(lesson_id, typeTest)
                let tempAll = await Helper.Temp(user_id, lesson_id, typeTest)                                
                if (tempAll.length == 0) {
                    let idx = 1
                    let modelQuestion = []
                    for (let index = 0; index < manage.length; index++) {
                        let value = manage[index];
                        modelQuestion.push(await Helper.Question(value['group_id'], value['manage_row']))
                        modelQuestion.forEach(element => {
                            let arrType4Answer = []
                            element.forEach(async (val, key) => {                                
                                let temp_test = {};
                                temp_test.user_id = user_id;
                                temp_test.lesson = lesson_id;
                                temp_test.group_id = val['group_id']
                                temp_test.ques_id = val['ques_id']
                                temp_test.type = typeTest;
                                temp_test.manage_id = value['manage_id']
                                let choice = []
                                let choiceData = []
                                choiceData = await Helper.func_getchoice(val['ques_id'])
                                choiceData.forEach(valChoice => {
                                    if (valChoice.choice_type != 'dropdown') {
                                        choice.push(`${valChoice.choice_id}`)
                                    } else {
                                        if (valChoice.choice_answer == 2) {
                                            let key = valChoice.choice_id.toString()
                                            arrType4Answer["A" + key] = valChoice.choice_id
                                        }
                                        if (valChoice.choice_answer == 1) {
                                            choice.push(`${valChoice.choice_id}`);
                                        }
                                    }
                                });
                                if (arrType4Answer.length > 0) {
                                    arrType4Answer.sort()
                                    let choiceA = []
                                    arrType4Answer.foreach(arrTypeVal => {
                                        choiceA.push(arrTypeVal)
                                    })
                                    choice = choice.concat(choiceA);
                                }
                                temp_test.question = JSON.stringify(choice);
                                temp_test.number = idx++;
                                temp_test.status = 0;
                                if (key == 0) {
                                    temp_test.time_start = 1
                                    temp_test.time_up = lesson[0].time_test * 60;
                                } else {
                                    temp_test.time_start = null;
                                    temp_test.time_up = null;
                                }
                                let status = await Helper.func_createTemp(temp_test); //temp_test->save();
                            });
                        });
                    }
                }
                let sql_number = ''
                console.log(typeTest);

                if (Number.isInteger(actionEvnt)) {                    
                    sql_number = 'AND number = ' + actionEvnt;
                } else {
                    sql_number = 'AND status="0"';
                }
                let currentQuiz = await Helper.TempQuiz(user_id, lesson_id, sql_number, typeTest)
                if (currentQuiz.length != 0) {

                    currentQuiz = await Helper.CurrentQuiz(user_id, lesson_id, typeTest)
                    
                }
                console.log("maxz");
                
                
                let model =await Helper.GetTempData(currentQuiz[0]['ques_id'])
                if (model != 0 || model != null) {                    
                    if (actionEvnt != null || actionEvnt != undefined) {
                        let key_ch
                        if (choice != undefined) {
                            for (const key in choice) {
                                choice[key].forEach(val => {
                                    key_ch = val[0]
                                });
                            }
                            
                            if (key_ch != null) {
        for (const question_id in question_type) {
            choice[question_id].forEach((value, index) => {
                choice[question_id][index] = value.toString()
            });            
            let update_temp = Helper.UpdateQuestion_type(JSON.stringify(choice[question_id]), user_id, lesson_id, question_id, typeTest)
        }                                
                            
                            }
                        }
                        if (dropdownVal != null || dropdownVal != undefined) {
                            for (const key in choice) {
                                choice[key].forEach(val => {
                                    key_ch = val[0]
                                });
                            }
                            if (key_ch != null) {
                                for (const question_id in question_type) {
                                    let update_temp = await Helper.UpdateQuestion_type(dropdownVal, user_id, lesson_id, question_id, typeTest)
                                }
                            }
                        }

                        if (actionEvnt == 'save' || actionEvnt == 'timeup') {
                            console.log("-------------------------------------------------------------------------");
                            for (let index = 0; index < manage.length; index++) {
                                let value = manage[index];
                                let modelCoursescore = {}
                                modelCoursescore.lesson_id = lesson_id
                                modelCoursescore.type = typeTest
                                modelCoursescore.course_id = lesson[0]['course_id']
                                modelCoursescore.user_id = user_id
                                modelCoursescore.manage_id = value.manage_id
                                modelCoursescore.score_count = countCourseScoreReady + 1
                                let save = await Helper.SaveScore(modelCoursescore)
                            }
                            let scoreIdx = []
                            let grandtotalscore = 0;
                            let grandtotalques = 0;
                            let full_score = 0; 
                            let modelScore 
                            for (let index = 0; index < manage.length; index++) {
                                let value = manage[index];
                                let temp_accept = await Helper.Temp_accept(user_id, lesson_id, typeTest, value.manage_id)                                
                                let countAllCoursequestion = 0;
                                let scoreSum = 0;
                                let modelCoursescore1 = await Helper.ModelCoursescore(user_id,lesson_id,value.manage_id)                                
                                scoreIdx.push(modelCoursescore1[0]['score_id'])
                                temp_accept.forEach(async (valueTemp_accept) => {
                                    full_score++
                                    let result = 0                                    
                                    if (valueTemp_accept['ques_type'] == 1) {
                                        console.log("++++++++++++++++++++++ques_type+1++++++++++++++++++++++++++");
                                        countAllCoursequestion += 1
                                        let coursequestion = await Helper.Coursequestion(valueTemp_accept['ques_id'])
                                        let choiceUserAnswerArray = []
                                        if (valueTemp_accept['ans_id'].length > 0) {
                                            choiceUserAnswerArray.push(JSON.stringify(valueTemp_accept['ans_id']))
                                        }
                                        let choiceCorrect = await Helper.CoursequestionChoice(value['ques_id'])

                                        let choiceCorrectArray = []
                                        choiceCorrect.forEach(valueChoiceCorrect => {
                                            choiceCorrectArray.push(valueChoiceCorrect.choice_id)
                                        });
                                        choiceUserAnswerArray.sort()
                                        if (choiceUserAnswerArray === choiceCorrectArray) {
                                            scoreSum++
                                            grandtotalscore++
                                            result = 1
                                        }                         
                             
                                           
                                        coursequestion.chioce.forEach(async (valueChioce) => {
                                            modelCourselogchoice.lesson_id = lesson_id
                                            modelCourselogchoice.logchoice_select = 1
                                            modelCourselogchoice.score_id = modelCoursescore1[0]['score_id']
                                            modelCourselogchoice.choice_id = valueChioce.choice_id
                                            modelCourselogchoice.ques_id = valueChioce.ques_id
                                            modelCourselogchoice.user_id = user_id
                                            modelCourselogchoice.is_valid_choice = valueChioce.choice_answer == "1" ? '1' : '0'
                                            modelCourselogchoice.logchoice_answer = (indexOf(valueChioce.choice_id, choiceUserAnswerArray)) ? 1 : 0
                                            modelCourselogchoice.user_idCreate = user_id
                                            modelCourselogchoice.user_idUpdate = user_id
                                            let saveLogChoice = await Helper.SaveLogChoice(modelCourselogchoice)
                                        });
                            

                                        modelCourselogques.lesson_id = lesson_id;
                                        modelCourselogques.score_id = modelCoursescore1[0]['score_id'];
                                        modelCourselogques.ques_id = valueTemp_accept['ques_id'];
                                        modelCourselogques.user_id = user_id;
                                        modelCourselogques.test_type = typeTest;
                                        modelCourselogques.ques_type = coursequestion.ques_type;
                                        modelCourselogques.result = result;
                                        modelCourselogques.user_idCreate = user_id
                                        modelCourselogques.user_idUpdate = user_id
                                        let saveLogQues = await Helper.SaveLogQues(modelCourselogques)
                                    } else if (valueTemp_accept['ques_type'] == 2) {
                                        console.log("++++++++++++++++++++++ques_type+2++++++++++++++++++++++++++");

                                        countAllCoursequestion += 1
                                        let coursequestion = await Helper.Coursequestion(valueTemp_accept['ques_id'])                                        
                                        let choiceUserAnswerArray = []
                                        if (valueTemp_accept['ans_id'].length > 0) {
                                            choiceUserAnswerArray.push(JSON.stringify(valueTemp_accept['ans_id']))
                                        }
                                        let choiceCorrect = await Helper.CoursequestionChoice(value.ques_id)

                                        let choiceCorrectArray = []
                                        choiceCorrect.forEach(valueChoiceCorrect => {
                                            choiceCorrectArray.push(valueChoiceCorrect.choice_id)
                                        });
                                        choiceUserAnswerArray.sort()
                                        if (choiceUserAnswerArray === choiceCorrectArray) {
                                            scoreSum++
                                            grandtotalscore++
                                            result = 1
                                        }
                             

                                        coursequestion.chioce.forEach(async valueChioce => {
                                            modelCourselogchoice.lesson_id = lesson_id
                                            modelCourselogchoice.logchoice_select = 1
                                            modelCourselogchoice.score_id = modelCoursescore1[0]['score_id']
                                            modelCourselogchoice.choice_id = valueChioce['choice_id']
                                            modelCourselogchoice.ques_id = valueChioce['ques_id']
                                            modelCourselogchoice.user_id = user_id
                                            modelCourselogchoice.is_valid_choice = valueChioce.choice_answer == "1" ? '1' : '0'
                                            modelCourselogchoice.logchoice_answer = (indexOf(valueChioce.choice_id, choiceUserAnswerArray)) ? 1 : 0
                                            modelCourselogchoice.user_idCreate = user_id
                                            modelCourselogchoice.user_idUpdate = user_id
                                            let saveLogChoice = await Helper.SaveLogChoice(modelCourselogchoice)
                                        });
           

                                        modelCourselogques.lesson_id = lesson_id;
                                        modelCourselogques.score_id = modelCoursescore1[0]['score_id'];
                                        modelCourselogques.ques_id = valueTemp_accept['ques_id'];
                                        modelCourselogques.user_id = user_id;
                                        modelCourselogques.test_type = typeTest;
                                        modelCourselogques.ques_type = coursequestion.ques_type;
                                        modelCourselogques.result = result;
                                        modelCourselogques.user_idCreate = user_id
                                        modelCourselogques.user_idUpdate = user_id
                                        let saveLogQues = await Helper.SaveLogQues(modelCourselogques)
                                    } else if (valueTemp_accept['ques_type'] == 4) {
                                        console.log("++++++++++++++++++++++ques_type+4++++++++++++++++++++++++++");
                                        let coursequestion = await Helper.Coursequestion(valueTemp_accept['ques_id'])
                                        let choiceUserAnswerArray = []
                                        if (valueTemp_accept['ans_id'].length > 0) {

                                            choiceUserAnswerArray.push(JSON.stringify(valueTemp_accept['ans_id']))
                                        }
                                        let choiceUserQuestionArray = []
                                        choiceUserQuestionArray.push(await Helper.CoursequestionChoice(value['ques_id']))

                                        let choiceCorrectIDs = []
                                        let choiceIsQuest = []

                                        choiceUserQuestionArray.forEach(async (UserQuestionArray, key) => {
                                            countAllCoursequestion += 1
                                            choiceIsQuest.push(UserQuestionArray)
                                            choiceCorrectID['Anschoice_id'] = choiceUserAnswerArray[key]
                                            let checkValue = 0
                                            if (choiceUserAnswerArray[key] == null)
                                                choiceUserAnswerArray[key] = 'null'
                                            let AnsChoice = await Helper.ChoiceQues(choiceUserAnswerArray[key])
                                            if (AnsChoice) {
                                                if (AnsChoice[0].reference == UserQuestionArray.choice_id) {
                                                    checkValue = 1
                                                    scoreSum++
                                                    grandtotalscore++
                                                    result = 1
                                                }
                                            }
                                            choiceCorrectID['checkVal'] = checkValue;
                                            choiceCorrectIDs[UserQuestionArray.choice_id] = choiceCorrectID
                                            let quest_score = 0
                                            coursequestion.chioce.forEach(dataCoursequestion => {
                                                let is_valid_choice = 0;
                                                let logchoice_answer = 0;

                                                coursequestion.chioce.forEach(async valueChioce => {
                                                    modelCourselogchoice.lesson_id = lesson_id
                                                    modelCourselogchoice.logchoice_select = 1
                                                    modelCourselogchoice.score_id = modelCoursescore1[0]['score_id']
                                                    modelCourselogchoice.choice_id = valueChioce.choice_id
                                                    modelCourselogchoice.ques_id = valueChioce.ques_id
                                                    modelCourselogchoice.user_id = user_id
                                                    modelCourselogchoice.user_idCreate = user_id
                                                    modelCourselogchoice.user_idUpdate = user_id
                                                    let checkChoice_quest = (indexOf(valueChioce.choice_id, choiceIsQuest)) ? valueChioce.choice_id : 0

                                                    if (checkChoice_quest != 0) {
                                                        logchoice_answer = choiceCorrectIDs[checkChoice_quest]['Anschoice_id'];

                                                        if (choiceCorrectIDs[checkChoice_quest]['checkVal'] == 1) {
                                                            is_valid_choice = 1;
                                                            quest_score++;
                                                        }
                                                    }
                                                    modelCourselogchoice.logchoice_answer = logchoice_answer
                                                    modelCourselogchoice.is_valid_choice = is_valid_choice == 1 ? 1 : 0;
                                                    let saveLogChoice = await Helper.SaveLogChoice(modelCourselogchoice)
                                                });
                                            });
                                        });

                                        modelCourselogques.lesson_id = lesson_id;
                                        modelCourselogques.score_id = modelCoursescore1[0]['score_id'];
                                        modelCourselogques.ques_id = valueTemp_accept['ques_id'];
                                        modelCourselogques.user_id = user_id;
                                        modelCourselogques.test_type = typeTest;
                                        modelCourselogques.ques_type = coursequestion.ques_type;
                                        modelCourselogques.result = result;
                                        modelCourselogques.user_idCreate = user_id
                                        modelCourselogques.user_idUpdate = user_id
                                        let saveLogQues = await Helper.SaveLogQues(modelCourselogques)
                                    }
                                });
                                let sumPoint = (scoreSum * 100) / countAllCoursequestion;
                        
                               await Helper.Modelscore(countAllCoursequestion, scoreSum, modelCoursescore1[0]['score_id'])
                                let grandtotalques
                                grandtotalques += countAllCoursequestion;                                
                                modelScore = await Helper.SelectScore(modelCoursescore1[0]['score_id'])
                            }
                            //++++++++++++++++++++++++++++++++++++//
                            let grandsumpoint = (grandtotalscore * 100) / grandtotalques;
                            let sumStatusTest = (grandsumpoint >= scorePercent);
                            scoreIdx.forEach(value => {
                                Helper.Modelscore1((sumStatusTest) ? 'y' : 'n', value)
                            });
                            if (lesson.status_passtest == 'y' && sumStatusTest && isPreTest && lesson.fileCount > 0) {
                                let learnModel = await Helper.LearnModel(lesson_id, user_id)
                                if (learnModel.length > 0) {

                                    learnLog.user_id = user_id
                                    learnLog.lesson_id = lesson.id
                                    learnLog.course_id = lesson.course_id
                                    learnLog.lesson_status = "passtest"
                                    learnLog.learn_date = 'NOW()'
                                    let saveLearnLog = await Helper.saveLearnLog(learnLog)
                                    lesson.files.forEach(async learn_file => {
                                        learnFile.learn_id = learnLog.learn_id
                                        learnFile.user_id_file = user_id
                                        learnFile.file_id = learn_file.id
                                        learnFile.learn_file_date = 'NOW()';
                                        learnFile.learn_file_status = "s";
                                        let savelearnFile = await Helper.SaveLearn_file(learnFile)
                                    });
                                } else {
                                    let learnModelUpdate = await Helper.LearnModelUpdate(user_id, lesson_id)
                                }
                                scoreIdx.forEach(async valueScoreIdx => {
                                    if (sumStatusTest) {
                                        let pre_id = await Helper.SelectScore(valueScoreIdx)
                                        postscore.lesson_id = pre_id.lesson_id
                                        postscore.user_id = user_id
                                        postscore.type = 'post'
                                        postscore.score_number = pre_id.score_number
                                        postscore.score_total = pre_id.score_total
                                        postscore.score_past = pre_id.score_past
                                        postscore.course_id = pre_id.course_id
                                        postscore.manage_id = pre_id.manage_id
                                        postscore.score_count = pre_id.score_count
                                        let save = Helper.SaveScore1(postscore)
                                    }
                                });
                            }
                            let courseStats = await Helper.CheckCoursePass(user_id, lesson.course_id)
                            let courseManageHave = await Helper.CheckHaveCourseTestInManage(lesson.course_id)                            
                            let getchoice =await Helper.func_getchoice(model[0]['ques_id'])

                            if (courseStats == 'pass' && !isPreTest && !courseManageHave) {
                                let passCoursModel = await Helper.PassCoursModel(lesson.CourseOnlines.cate_id, user_id)
                                if (!passCoursModel) {
                                    modelPasscours.passcours_cates = lesson.CourseOnlines.cate_id
                                    modelPasscours.passcours_cours = lesson.course_id
                                    modelPasscours.passcours_user = user_id
                                    modelPasscours.passcours_date = 'NOW()'
                                    let save =await Helper.INSERTpassCoursModel(modelPasscours)
                                }
                            }
                            console.log(typeTest);
                            
                            await Helper.DeleteTemp(user_id, lesson_id, typeTest)
                            let data = {}
                            data.status = true;
                            data.question = model;
                            data.choice = getchoice;
                            data.lesson = lesson;
                            data.temp_all = tempAll;
                            data.typeTest = typeTest;
                            data.modelScore = modelScore;
                            data.grandtotalscore = grandtotalscore;
                            data.full_score = full_score;
                            res.json(data)

                        } else {
                            let temp_count = await Helper.CountTempAll(user_id, lesson_id, typeTest)                            
                            let idx = 0
                            if (actionEvnt == 'next') {
                                idx =parseInt(idx_now)+ 1
                                if (parseInt(idx_now) == temp_count[0]['count']) {
                                    idx = 1
                                }
                            } else if (actionEvnt == 'previous') {
                                idx = parseInt(idx_now) - 1
                                if (parseInt(idx_now) == 1) {
                                    idx = temp_count[0]['count']
                                }
                            } else {
                                idx = actionEvnt
                            }
                            let count_no_select = await Helper.Count_no_select(user_id, lesson_id, typeTest)
                            let last_ques = count_no_select == 0 ? 1 : 0
                            let currentQuizNumber = await Helper.CurrentQuizNumber(user_id, lesson_id, typeTest, idx)                            
                            let model =await Helper.GetTempData(currentQuizNumber[0]['ques_id'])
                            let getchoice =await Helper.func_getchoice(currentQuizNumber[0]['ques_id'])
                            let tempAll = await Helper.Temp(user_id, lesson_id, typeTest)                            
                            let countExam = tempAll.length - count_no_select[0]['count']

                            let data = {}
                            data.status = true;
                            data.question = model;
                            data.choice = getchoice;
                            data.lesson = lesson;
                            data.temp_all = tempAll;
                            data.typeTest = typeTest;
                            data.currentQuiz = currentQuizNumber;
                            data.last_ques = last_ques;
                            data.countExam = countExam;
                            res.json(data)
                        }
                    } else {                        
                        let count_no_select = await Helper.Count_no_select(user_id, lesson_id, typeTest)
                        let last_ques = count_no_select == 0 ? 1 : 0
                        let tempAll = await Helper.Temp(user_id, lesson_id, typeTest)
                        let countExam = tempAll.length - count_no_select[0]['count']
                        let currentQuizNumber = await Helper.CurrentQuizNumber(user_id, lesson_id, typeTest, idx)                            
                        let model =await Helper.GetTempData(currentQuizNumber[0]['ques_id'])
                        let getchoice =await Helper.func_getchoice(currentQuizNumber[0]['ques_id'])

                        let data = {}
                        data.status = true;
                        data.question = model;
                        data.choice = getchoice;
                        data.lesson = lesson;
                        data.temp_all = tempAll;
                        data.typeTest = typeTest;
                        data.currentQuiz = currentQuizNumber;
                        data.last_ques = last_ques;
                        data.countExam = countExam;
                        data.time_up = temp_all[0].time_up;
                        res.json(data)
                    }
                } else {
                    let data = {};
                    data.status = false;
                    data.msg = 'ขณะนี้ยังไม่มีข้อสอบ';
                    res.json(data)
                }
            }
        }
    } else {
        data.status = false
        data.msg = "กรุณาเรียนให้ผ่านก่อน"
        res.json(data)
    }

})

module.exports = router;