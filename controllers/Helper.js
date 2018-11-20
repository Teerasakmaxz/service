let PreExams = require('../models/PreExams')
let PostExams = require('../models/PreExamsIndex')
let Temp = require('../models/Temp')
let Question = require('../models/Question')
let Lesson = require('../models/Lesson')
let User = require('../models/User')


exports.CheckTestCount = async (userstatus, id, return_val = false, check = true, type) => {
    return new Promise(async (resolve, reject) => {
        let CheckTesting;
        try {
            if (status == "learning") {
                if (check == true) {
                    if (return_val == true) {
                        CheckTesting = 'ยังไม่มีสิทธิ์ทำแบบทดสอบหลังเรียน';
                    } else {
                        CheckTesting = false; //No Past
                    }
                } else {
                    CheckTesting = false;
                }
            } else if (status == "notLearn") {
                if (check == true) {
                    if (return_val == true)
                        //                    $CheckTesting = '-';
                        CheckTesting = 'ยังไม่เข้าเรียน';
                    else
                        CheckTesting = false; //No Past
                } else {
                    CheckTesting = false;
                }
            } else if ($status == "pass") {
                let countManage = 0;
                await this.Manage(lesson_id, testtype, (err, rows) => {
                    countManage = rows.length;
                });

                //Condition Testing
                if (countManage > 0) {
                    let Lesson = await this.func_getLesson(lesson_id);
                    let lesson_new = await this.func_getTestAmount(user_id, lesson_id, type);
                    let countScorePast = await this.func_getscore(user_id, lesson_id, type);
                    // $countScorePast = Score::Model()->count("lesson_id=:lesson_id AND user_id=:user_id AND type=:type AND active=:active", array(
                    //     "lesson_id" => $id, "user_id" => Yii::app()->user->id, "type" => $type , "active"=>'y'
                    //     ));
                    if (countScorePast != null) {
                        if (check == true) {
                            if (return_val == true) {
                                CheckTesting = 'ผลการทดสอบ';
                            } else {
                                CheckTesting = true; //Past
                            }
                        } else {
                            CheckTesting = true;
                        }
                    } else {

                        if (lesson_new == Lesson.cate_amount) {
                            if (check == true) {
                                if (return_val == true) {
                                    CheckTesting = 'ทำแบบทดสอบไม่ผ่าน';
                                } else {
                                    CheckTesting = false; //No Past
                                }

                            } else {
                                CheckTesting = true;
                            }
                        } else {
                            if (check == true) {
                                if (return_val == true) {
                                    CheckTesting = 'ทำแบบทดสอบ';
                                } else {
                                    CheckTesting = false; //No Past
                                }
                            } else {
                                CheckTesting = false;
                            }
                        }

                    }
                } else {
                    if (check == true) {
                        if (return_val == true) {
                            CheckTesting = 'ไม่มีแบบทดสอบ';
                        } else {
                            CheckTesting = true; //Past
                        }
                    } else {
                        CheckTesting = false;
                    }
                }
            } else {
                if (check == true) {
                    if (return_val == true) {
                        CheckTesting = 'ต้องเรียนให้ผ่านทุกหัวข้อ';
                    } else {
                        CheckTesting = false; //No Past
                    }
                } else {
                    CheckTesting = false;
                }
            }
            return CheckTesting;
        } catch (error) {
            reject(error)
        }
    })
}
exports.CheckCoursePass = async (user_id, course_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Lesson.getLessonForCourseID(course_id, user_id, async (err, rows) => {
                let lessonAllCount = rows.length;
                let lessonPassCount = 0;
                if (rows.length > 0) {
                    rows.forEach(async element => {
                        if (await this.checkLessonPass(element) == "pass") {
                            if (await $this.CheckTestCount('pass', element.id, false, true, 'post') == true) {
                                lessonPassCount++;
                            }
                        }
                        if (lessonAllCount == lessonPassCount) {
                            resolve("pass");
                        } else {
                            resolve("notPass");
                        }
                    });
                } else {
                    resolve("notPass");
                }

            })
        } catch (error) {
            reject(error)
        }
    })

}
exports.isPretestState = (lesson_id, user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (await this.LessonState(lesson_id) == false) {

                resolve(false)
            } else if (await this.CheckHavePreTestInManage(lesson_id, 'pre') == false) {

                resolve(false)
            } else if (await this.HaveScore(user_id, lesson_id) == false) {
                resolve(true)
            } else {
                resolve(false)
            }


        } catch (err) {
            reject(new Error('Oops!1'));
        }
    });
}

exports.isPosttestState = (lesson_id, user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (await this.LessonState(lesson_id) == false) {
                resolve(false)
            } else if (await this.CheckHavePreTestInManage(lesson_id, 'post') == false) {
                resolve(false)
            } else if (await !this.HaveScore(user_id, lesson_id) == false) {
                resolve(true)
            } else {
                resolve(false)
            }


        } catch (err) {
            await reject(new Error('Oops!1'));
        }
    });
}

exports.CheckLessonPass = (lesson, lesson_id, user_id) => {
    return new Promise(async (resolve, reject) => {

        try {
            let countFile
            let countLearnCompareTrueVdos
            let learnLesson = await this.Learn(user_id, lesson_id)

            if (lesson[0].type == 'vdo') {
                countFile = await this.FileCount(lesson_id)
                countLearnCompareTrueVdos = await this.countLearnCompareTrueVdos(lesson_id, user_id)
            } else if (lesson[0].type == 'pdf') {
                countFile = await this.FilePDFCount(lesson_id)
                countLearnCompareTrueVdos = await this.CountLearnCompareTruePdf(lesson_id, user_id)

            }
            if (learnLesson.length == 0) {
                resolve("notLearn")
            } else {
                if (learnLesson && (learnLesson[0]["lesson_status"] == 'pass' || learnLesson[0]["lesson_status"] == 'passtest')) {
                    resolve("pass");
                } else {
                    if (countFile[0]["filecount"] == 0) {
                        let Statuseturn = 'pass';
                        if (this.isPretestState(lesson_id)) {
                            let checkpretest_do = this.CheckTest(lesson, 'pre')

                            if (!checkpretest_do.value.boolean) {
                                Statuseturn = "notLearn";
                            }
                        }
                        if (this.isPosttestState(lesson_id)) {
                            let checkpretest_do = this.CheckTest(lesson, 'post')

                            if (!checkpretest_do.value.boolean) {
                                Statuseturn = "notLearn";
                            }
                        }
                        resolve(Statuseturn)
                    } else {
                        if ((countFile[0]["filecount"] != 0) && learnLesson) {
                            if (countLearnCompareTrueVdos[0]["countLearnCompareTrue"] != countFile[0]["filecount"]) {
                                resolve("learning");
                            } else {
                                resolve("pass");
                            }
                        } else {
                            resolve("notLearn");
                        }
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

exports.CheckTest = async (user_id, lesson_id, lesson, type) => {
    let score
    if (lesson) {
        let data = {}
        if (type == 'post') {
            score = this.Score(user_id, lesson_id)
            if (score[0].score_past != null) {
                let percent = (score[0].score_number / score[0].score_total) / 100
                percent = parseInt(percent)
                if (score[0].score_past == 'y') {
                    data.value.text = "ทั้งหมด " + score[0].score_total + " ข้อ ถูก " + score[0].score_number + " ข้อ"
                    data.option.color = "#0C9C14"
                    data.value.status = "(ผ่าน)"
                    data.value.statusBoolean = true
                    data.value.score = score[0].score_number
                    data.value.total = score[0].score_total
                } else {
                    data.value.text = "ทั้งหมด " + score[0].score_total + " ข้อ ถูก " + score[0].score_number + " ข้อ"
                    data.option.color = "#D9534F"
                    data.value.status = "(ไม่ผ่าน)"
                    data.value.statusBoolean = false
                    data.value.score = score[0].score_number
                    data.value.total = score[0].score_total
                }
                data.value.percent = percent
                data.value.boolean = true
            } else {
                let checkPostTest = await this.CheckHavePostTestInManage(lesson_id)
                if (checkPostTest) {
                    data.value.percent = 0
                    data.option.color = "#D9534F"
                    data.value.text = "ยังไม่ทำแบบทดสอบหลังเรียน"
                    data.value.boolean = false
                } else {
                    data.value.percent = 0
                    data.option.color = "#D9534F"
                    data.value.text = "ยังไม่ทำแบบทดสอบหลังเรียน"
                    data.value.boolean = false
                }
            }
        } else if (type == 'pre') {
            score = this.Score(user_id, lesson_id)
            if (score[0].score_past != null) {
                let percent = (score[0].score_number / score[0].score_total) / 100
                percent = parseInt(percent)
                if (score[0].score_past == 'y') {
                    data.value.text = "ทั้งหมด " + score[0].score_total + " ข้อ ถูก " + score[0].score_number + " ข้อ"
                    data.option.color = "#0C9C14"
                    data.value.status = "(ผ่าน)"
                    data.value.statusBoolean = true
                    data.value.score = score[0].score_number
                    data.value.total = score[0].score_total
                } else {
                    data.value.text = "ทั้งหมด " + score[0].score_total + " ข้อ ถูก " + score[0].score_number + " ข้อ"
                    data.option.color = "#D9534F"
                    data.value.status = "(ไม่ผ่าน)"
                    data.value.statusBoolean = false
                    data.value.score = score[0].score_number
                    data.value.total = score[0].score_total
                }
                data.value.percent = percent
                data.value.boolean = true
            } else {
                let checkPostTest = await this.CheckHavePostTestInManage(lesson_id)
                if (checkPostTest) {
                    data.value.percent = 0
                    data.option.color = "#D9534F"
                    data.value.text = "ยังไม่ทำแบบทดสอบหลังเรียน"
                    data.value.boolean = false
                } else {
                    data.value.percent = 0
                    data.option.color = "#D9534F"
                    data.value.text = "ยังไม่ทำแบบทดสอบหลังเรียน"
                    data.value.boolean = false
                }
            }
        }
        resolve(data)
    }
}

exports.Lesson = (lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            let data_lesson = []
            PreExams.lesson(lesson_id, (err, rows) => {
                rows.forEach((val, index) => {
                    data_lesson[index] = val
                })
                resolve(data_lesson)
            })
        } catch (error) {

            reject("1" + error)
        }
    })
}

exports.HaveScore = (user_id, lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.haveScore(user_id, lesson_id, (err, rows) => {

                resolve(rows.length > 0 ? true : false)
            })
        } catch (err) {
            reject(new Error('Oops!2'));
        }
    });
}
exports.CheckHavePreTestInManage = (lesson_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.checkHavePreTestInManage(lesson_id, type, (err, rows) => {
                resolve(rows.length > 0 ? true : false)
            })
        } catch (err) {
            reject(new Error('Oops!3'));
        }
    });
}

exports.Manage = (lesson_id, testType) => {
    return new Promise((resolve, reject) => {
        try {
            let manage1 = 0;
            PreExams.manage(lesson_id, testType, (err, rows) => {
                rows.forEach(element => {
                    let c_row = element.manage_row
                    manage1 += c_row
                });
                resolve(manage1)

            })
        } catch (error) {

        }
    })
}

exports.getManage = (lesson_id, testType) => {
    return new Promise((resolve, reject) => {
        try {
            let manage1 = 0;
            PreExams.manage(lesson_id, testType, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {

        }
    })
}

exports.LessonState = (lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.lesson(lesson_id, (err, rows) => {
                resolve(rows.length > 0 ? true : false)
            })
        } catch (err) {
            reject(new Error('Oops!4'));
        }
    });
}
exports.CurrentQuiz = (user_id, lesson, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.currentQuiz(user_id, lesson, type, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.CountCourseScoreReady = (user_id, lesson_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            PostExams.countCourseScoreReady(user_id, lesson_id, type, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.Learn = (user_id, lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PostExams.learnLesson(user_id, lesson_id, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {

        }

    })
}
exports.FileCount = (lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PostExams.fileCount(lesson_id, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.FilePDFCount = (lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PostExams.filePDFCount(lesson_id, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.CountLearnCompareTruePdf = (lesson_id, user_id) => {
    return new Promise((resolve, reject) => {
        try {

            PostExams.countLearnCompareTrueVdos(lesson_id, user_id, (err, rows) => {
                resolve(rows)
            })

        } catch (error) {
            reject(error)
        }
    })
}
exports.countLearnCompareTrueVdos = (lesson_id, user_id) => {
    return new Promise((resolve, reject) => {
        try {

            PostExams.CountLearnCompareTruePdf(lesson_id, user_id, (err, rows) => {
                resolve(rows)
            })

        } catch (error) {
            reject(error)
        }
    })
}
exports.Score = (user_id, lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PostExams.score(user_id, lesson_id, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {

        }
    })
}
exports.CheckHavePostTestInManage = (lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.checkHavePostTestInManage(lesson_id, (err, rows) => {
                resolve(rows.length > 0 ? true : false)
            })

        } catch (error) {
            resolve(error)
        }

    })
}
exports.func_getLesson = (user_id, lesson_id) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.lesson(lesson_id, (err, rows) => {
                resolve(rows[0]);
            })
        } catch (err) {
            reject(new Error('Oops!5'));
        }
    });
}
exports.func_getTestAmount = (user_id, lesson_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.testamount(user_id, lesson_id, type, (err, rows) => {
                resolve(rows.length);
            })
        } catch (err) {
            reject(new Error('Oops!6'));
        }
    });
}
exports.func_getscore = (user_id, lesson_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.score(user_id, lesson_id, type, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!7'));
        }
    });
}
exports.func_getscore1 = (user_id, lesson_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.score1(user_id, lesson_id, type, (err, rows) => {

                resolve(rows);
            })
        } catch (err) {

            reject(new Error('Oops!8'));
        }
    });
}
exports.Temp = (user_id, lesson_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            Temp.tempAll(user_id, lesson_id, type, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {

        }
    })
}
exports.SaveLearnLog=(learnLog)=>{
    return new Promise((resolve,reject)=>{
        PreExams.saveLearnLog(learnLog,(err,rows)=>{
            resolve(rows)
        })
    })
}

exports.SaveLearn_file =(learnFile) =>{
    return new Promise((resolve,reject)=>{
        PreExams.saveLearn_file(learnFile,(err,rows)=>{
            resolve(rows)
        })
    })
}
exports.CountTempAll = (user_id, lesson_id, type)=>{
    return new Promise((resolve,reject)=>{
        try {
            Temp.countTempAll(user_id, lesson_id, type,(err,rows)=>{
                resolve(rows)
            })
        } catch (error) {
            
        }
    })
}
exports.Count_no_select = (user_id,lesson,type)=>{
    return new Promise ((resolve,reject)=>{
        try {
            PreExams.count_no_select(user_id,lesson,type,(err,rows)=>{
                resolve(rows)
            })
        } catch (error) {
            
        }
    })
}
exports.CurrentQuizNumber = (user_id, lesson, type, number)=>{
    return new Promise ((resolve,reject)=>{
        Temp.currentQuizNumber(user_id, lesson, type, number,(err,rows)=>{
            resolve(rows)
        })
    })
}
exports.DeleteTemp =(user_id,lesson_id,type)=>{
    return new Promise((resolve,reject)=>{
        PreExams.deleteTemp(user_id,lesson_id,type,(err,rows)=>{
            resolve(rows)
        })
    })
}
exports.Question = (group_id, manage_id) => {
    return new Promise((resolve, reject) => {
        try {
            Question.question(group_id, manage_id, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.GetTempData = (group_id) => {
    return new Promise((resolve, reject) => {
        try {
            Question.getTempData(group_id, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.func_getchoice = (ques_id) => {
    return new Promise((resolve, reject) => {
        try {
            Lesson.getchoice(ques_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!9'));
        }
    });
}
exports.func_createTemp = (temp_test) => {
    return new Promise((resolve, reject) => {
        try {
            Lesson.createTemp(temp_test, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!10'));
        }
    });
}
exports.CountManage = (lesson_id, testType) => {
    return new Promise((resolve, reject) => {
        try {
            PostExams.countManage(lesson_id, testType, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(new Error('Oops!11'));
        }
    })
}
exports.Province = () => {

    return new Promise((resolve, reject) => {
        User.province((err, rows) => {

            resolve(rows)
        })
    })


}
exports.TempQuiz = (user_id,lesson,sql_number, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.tempQuiz(user_id, lesson, sql_number, type, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.UpdateQuestion_type = (ans_id,user_id, lesson, ques_id, type) => {
    return new Promise((resolve, reject) => {
        try {
            PreExams.updateQuestion_type(ans_id,user_id, lesson, ques_id, type, (err, rows) => {
                resolve(rows)
            })
        } catch (error) {
            reject(error)
        }
    })
}
exports.SaveScore = (model) => {
    return new Promise((resolve, reject) => {
        PreExams.saveScore(model, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.SaveScore1 = (model) => {
    return new Promise((resolve, reject) => {
        PreExams.saveScore1(model, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.Temp_accept = (user_id, lesson_id, type, manage_id) => {
    return new Promise((resolve, reject) => {
        PreExams.temp_accept(user_id, lesson_id, type, manage_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.ModelCoursescore = (user_id, lesson_id, manage_id) => {
    return new Promise((resolve, reject) => {
        PreExams.modelCoursescore(user_id, lesson_id, manage_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.Coursequestion = (ques_id) => {
    return new Promise((resolve, reject) => {
        PreExams.coursequestion(ques_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.CoursequestionChoice = (ques_id) => {
    return new Promise((resolve, reject) => {
        PreExams.coursequestionChoice(ques_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.SaveLogChoice = (model) => {
    return new Promise((resolve, reject) => {
        PreExams.saveLogChoice(model, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.SaveLogQues = (model) => {
    return new Promise((resolve, reject) => {
        PreExams.saveLogQues(model, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.ChoiceQues = (data) => {
    return new Promise((resolve, reject) => {
        PreExams.choiceQues(data, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.Modelscore = (score_total, score_number, score_id) => {
    return new Promise((resolve, reject) => {
        PreExams.modelscore(score_total, score_number, score_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.Modelscore1 = (score_past, score_id) => {
    return new Promise((resolve, reject) => {
        PreExams.modelscore1(score_past, score_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.LearnModel = (lesson_id, user_id) => {
    return new Promise((resolve, reject) => {
        PreExams.learnModel(lesson_id, user_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.LearnModelUpdate = (lesson_id, user_id) => {
    return new Promise((resolve, reject) => {
        PreExams.learnModelUpdate(lesson_id, user_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.SelectScore = (id) => {
    return new Promise((resolve, reject) => {
        PreExams.selectScore(id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.LessonAll = (course_id) => {
    return new Promise((resolve, reject) => {
        PreExams.lessonAll(course_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.LessonAllCount = (course_id) => {
    return new Promise((resolve, reject) => {
        PreExams.lessonAllCount(course_id, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.CheckCoursePass = async (course_id, user_id) => {
    let lessonAll = await this.LessonAll(course_id)
    let lessonAllCount = await this.LessonAllCount(course_id)
    let lessonPassCount = 0;
    if (lessonAll.length > 0) {
        lessonAll.forEach(value => {
            if (this.CheckLessonPass(value, value.lesson_id, user_id) == 'pass') {
                if (this.CheckTestCount('pass', value.lesson_id, true, false, 'post' == true)) {
                    lessonPassCount++
                }
            }
        });
        if (lessonAllCount == lessonPassCount) {
            return "pass";
        } else {
            return "notPass";
        }
    } else {
        return "notPass";
    }
}


exports.Lesson_new = (lesson_id, user_id, type) => {
    return new Promise((resolve, reject) => {
        PreExams.lesson_new(lesson_id, user_id, type, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.CountScorePast = (lesson_id, user_id, type) => {
    return new Promise((resolve, reject) => {
        PreExams.countScorePast(lesson_id, user_id, type, (err, rows) => {
            resolve(rows)
        })
    })
}
exports.Lesson1 = (leeson_id) => {
    return new Promise((resolve, reject) => {
        PreExams.lesson(leeson_id, (err, rows) => {
            resolve(rows)
        })
    })
}

exports.CheckTestCount = async (status, id, returnParam = false, check = true, type, user_id) => {
    let checkTesting = ''
    if (status == "learning") {
        if (check == true) {
            if (returnParam == true) {
                checkTesting = '<label style="color: #E60000;">ยังไม่มีสิทธิ์ทำแบบทดสอบหลังเรียน</label>';
            } else {
                checkTesting = false; //No Past
            }
        } else {
            checkTesting = false;
        }
    } else if (status == 'notLearn') {
        if (check == true) {
            if (returnParam == true) {
                checkTesting = '<label style="color: #E60000">ยังไม่เข้าเรียน</label>';
            } else {
                checkTesting = false; //No Past
            }
        } else {
            checkTesting = false;
        }
    } else if (status == 'pass') {
        let countManage = this.CountManage(id, 'post')
        if (!countManage.length == 0) {
            let lesson = await this.Lesson1(id)
            let lesson_new = await this.Lesson_new(id, user_id, type)
            let countScorePast = await this.CountScorePast(id, user_id, type)
            if (!countScorePast.length == 0) {
                if (check == true) {
                    if (returnParam == true) {
                        checkTesting = '<label style="color: #E60000">ลิ้ง</label>';
                    } else {
                        checkTesting = true; //Past
                    }
                } else {
                    checkTesting = true;
                }
            } else {
                if (lesson_new == lesson.cate_amount) {
                    if (check == true) {
                        if (returnParam == true) {
                            checkTesting = '<label style=" color: #E60000;">ทำแบบทดสอบไม่ผ่าน</label>';
                        } else {
                            checkTesting = false; //No Past
                        }

                    } else {
                        checkTesting = true;
                    }
                } else {
                    if (check == true) {
                        if (returnParam == true) {
                            checkTesting = 'ทำแบบทดสอบ'
                        } else {
                            checkTesting = false; //No Past
                        }
                    } else {
                        checkTesting = false;
                    }
                }
            }
        } else {
            if (check == true) {
                if (returnParam == true) {
                    checkTesting = '<label style="color: #E60000">ไม่มีแบบทดสอบ</label>';
                } else {
                    checkTesting = true; //Past
                }
            } else {
                checkTesting = false;
            }
        }
    } else {
        if (check == true) {
            if (returnParam == true) {
                checkTesting = '<label style="color: #E60000">ต้องเรียนให้ผ่านทุกหัวข้อ</label>';
            } else {
                checkTesting = false; //No Past
            }
        } else {
            checkTesting = false;
        }
    }
    return checkTesting;
}

exports.IsExamAddToCourseForTest=(course_id)=>{
    return new Promise((resolve,reject)=>{
        PreExams.isExamAddToCourseForTest(course_id,(err,rows)=>{
            resolve(rows)
        })
    })
}

exports.CheckHaveCourseTestInManage =(course_id)=>{
    let isExamAddToCourseForTest = this.IsExamAddToCourseForTest(course_id)
    if (isExamAddToCourseForTest.length > 0) {
        return false;
    }else{
        return true;
    }
}
exports.PassCoursModel=(passcours_cates,user_id)=>{
    return new Promise((resolve,reject)=>{
        PreExams.passCoursModel(passcours_cates,user_id,(err,rows)=>{
            resolve(rows)
        })
    })
}