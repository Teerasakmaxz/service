var express = require('express');
var router = express.Router();
let Helper = require('../controllers/Helper');
var CourseOnline = require('../models/CourseOnline');

router.post('/Index', async (req, res) => {
    CourseOnline.getCourseTeacher(req.body.id, async (err, rows) => {
        if (err) {
            res.json(err);
        } else {
            let dataAll = {};
            if (rows.length > 0) {
                ////// if choice
                if (req.body.choice) {
                    ///////////////////// Delete ข้อมูลเดิม //////////////////////////
                    let checkAnswerOld = await func_getdoSurvey(rows[0].course_id, req.body.user_id, rows[0].survey_header_id);
                    
                    if (checkAnswerOld) {
                        await func_deleteAnswerOld(rows[0].course_id, req.body.user_id, rows[0].survey_header_id);
                    }
                    //////////////////////////////////////////////////////////////////

                    let log = await func_createQQuestAns_course(rows[0].course_id, req.body.user_id, rows[0].survey_header_id, rows[0].teacher_id);
                    
                    let logid = log.insertId;
                    if (req.body.choice.input) {
                        let  data_input = req.body.choice.input;
                        for (let option_choice_id in data_input) {  
                        // req.body.choice.input.forEach(async (value, option_choice_id) => {
                            let answer_text = data_input[option_choice_id];
                            let answer_numeric = null;
                            let answer_textarea = null;
                            await func_createQAnswers_course(req.body.user_id, option_choice_id, logid,answer_text,answer_numeric,answer_textarea);
                        }
                    }

                    if (req.body.choice.radio) {
                        let  data_radio = req.body.choice.radio;
                        for (let question_id in data_radio) {  
                        // req.body.choice.radio.forEach(async (option_choice_id, question_id) => {
                            let answer_text = null;
                            let answer_numeric = null;
                            let answer_textarea = null;
                            if (req.body.choice.radioOther.question_id.option_choice_id) {
                                 answer_text = req.body.choice.radioOther.question_id.option_choice_id;
                            }
                            await func_createQAnswers_course(req.body.user_id, data_radio[question_id], logid,answer_text,answer_numeric,answer_textarea);
                        }
                    }

                    if (req.body.choice.checkbox) {
                        let  data_checkbox = req.body.choice.checkbox;
                        for (let question_id in data_checkbox) {  
                        // req.body.choice.checkbox.forEach((checkboxArray, question_id) => {
                            let checkboxArray = data_checkbox[question_id];
                            // checkboxArray.forEach(async (option_choice_id, key) => {
                            for (let key in checkboxArray) {  
                                let answer_text = null;
                                let answer_numeric = null;
                                let answer_textarea = null;
                                if (req.body.choice.checkboxOther.question_id.option_choice_id) {
                                    answer_text = req.body.choice.checkboxOther.question_id.option_choice_id;
                                }
                                await func_createQAnswers_course(req.body.user_id, checkboxArray[key], logid,answer_text,answer_numeric,answer_textarea);
                            }
                        }
                    }

                    if (req.body.choice.contentment) {
                        let  data_content = req.body.choice.contentment;
                        for (let option_choice_id in data_content) {  
                            let answer_text = null;
                            let answer_numeric = data_content[option_choice_id];
                            let answer_textarea = null;
                            await func_createQAnswers_course(req.body.user_id, option_choice_id, logid,answer_text,answer_numeric,answer_textarea);
                        }
                    }

                    if (req.body.choice.text) {
                        // req.body.choice.text.forEach(async (value, option_choice_id) => {
                        let  data_text = req.body.choice.text;
                        for (let option_choice_id in data_text) {  
                            let answer_text = null;
                            let answer_numeric = null;
                            let answer_textarea = data_text[option_choice_id];
                            await func_createQAnswers_course(req.body.user_id, option_choice_id, logid,answer_text,answer_numeric,answer_textarea);
                        }
                    }
                    res.json({'status':true});
                    exit();
                }

                ////////////////
                dataAll.questionnaire = rows[0];
                dataAll.status = true;
                let header = await func_getHeader(rows[0].survey_header_id);
                if (header.length > 0) {
                    let data_section = [];
                    let sections = await func_getSections(rows[0].survey_header_id);
                    if (sections.length > 0) {
                        dataAll.survey = {};
                        dataAll.survey.name = header[0].survey_name;
                        dataAll.survey.instructions = header[0].instructions;
                        // sections.forEach(async val_sec => {
                        for (let index_sec = 0; index_sec < sections.length; index_sec++) {
                            const val_sec = sections[index_sec];
                            let questions = await func_getQuestions(val_sec.survey_section_id);
                            if (questions.length > 0) {
                                let getdata_question = await func_loopDataquestion(questions);
                                let set_section = {};
                                set_section.section = val_sec;
                                set_section.item = getdata_question;
                                data_section.push(set_section);
                            }
                        }
                        console.log(data_section);
                        //////////////////////////////////////////////////////////////////////////
                        dataAll.survey.item = data_section;
                        /////////////////////////////////////////////////////////////////////
                    }
                }
            } else {
                dataAll.status = false;
            }
            res.json(dataAll); //or return count for 1 &amp;amp;amp; 0
        }
    });

})

async function func_loopDataquestion(questions) {
    return new Promise(async (resolve, reject) => {
        try {
            let data_question = [];
            for (let index = 0; index < questions.length; index++) {
                const element = questions[index];
                let data_ques_sub = [];
                let data_choice = [];
                if (element.input_type_id == '1') {
                    let arrCh1 = {};
                    arrCh1.type = 'input';
                    arrCh1.name_id = element.question_id;
                    arrCh1.val = '';
                    arrCh1.text = '';
                    data_choice.push(arrCh1);
                } else if (element.input_type_id == '2' || element.input_type_id == '3') {
                    let dataCh2 = await func_getChoices(element.question_id);
                    if (dataCh2.length > 0) {
                        dataCh2.forEach(async val_ch2 => {
                            let arrCh23 = {};
                            arrCh23.type = 'checkbox';
                            arrCh23.name_id = element.question_id;
                            arrCh23.val = val_ch2.option_choice_id;
                            arrCh23.text = val_ch2.option_choice_name;
                            data_choice.push(arrCh23);
                        })
                    }
                } else if (element.input_type_id == '4') {
                    let dataCh4 = await func_getChoices(element.question_id);
                    if (dataCh4.length > 0) {
                        dataCh4.forEach(async val_ch4 => {
                            let data_choice_sub = [];
                            for (let i = 5; i >= 1; i--) {
                                let arrCh4 = {};
                                arrCh4.type = 'contentment';
                                arrCh4.name_id = val_ch4.option_choice_id;
                                arrCh4.val = i;
                                arrCh4.text = '';
                                data_choice_sub.push(arrCh4);
                            }
                            let ques_sub_ch4 = {};
                            ques_sub_ch4.sub_ques = val_ch4;
                            ques_sub_ch4.choice = data_choice_sub;
                            data_ques_sub.push(ques_sub_ch4);
                        })
                    }
                } else if (element.input_type_id == '5') {
                    let dataCh5 = await func_getChoices(element.question_id);
                    let arrCh5 = {};
                    arrCh5.type = 'text';
                    arrCh5.name_id = dataCh5[0].option_choice_id;
                    arrCh5.val = '';
                    arrCh5.text = '';
                    data_choice.push(arrCh5);
                }
                let set_question = {};
                set_question.question = element;
                set_question.data_ques_sub = data_ques_sub;
                set_question.choice = data_choice;
                data_question.push(set_question);
            }
            resolve(data_question);
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_getHeader(survey_header_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.getHeader(survey_header_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_getSections(survey_header_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.getSection(survey_header_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_getQuestions(survey_section_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.getQuestions(survey_section_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_getChoices(question_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.getChoices(question_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_getdoSurvey(course_id, user_id, survey_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.getdoSurvey(course_id, user_id, survey_id, (err, rows) => {
                if (rows[0] == null) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_deleteAnswerOld(course_id, user_id, survey_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.deleteAnswerOld(course_id, user_id, survey_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_createQQuestAns_course(course_id, user_id, survey_id, teacher_id) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.createQQuestAns_course(course_id, user_id, survey_id, teacher_id, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

function func_createQAnswers_course(user_id, option_choice_id, logid,answer_text,answer_numeric,answer_textarea) {
    return new Promise((resolve, reject) => {
        try {
            CourseOnline.createQAnswers_course(user_id, option_choice_id, logid,answer_text,answer_numeric,answer_textarea, (err, rows) => {
                resolve(rows);
            })
        } catch (err) {
            reject(new Error('Oops!'));
        }
    });
}

module.exports = router;