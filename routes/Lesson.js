var express = require('express');
var router = express.Router();
var Lesson = require('../models/Lesson');

var lessonAll =[];
var id=[];
var index;
router.get('/courseID/:id/:user_id?', (req, res, next) => {
  Lesson.getLessonForCourseID(req.params.id,async (err,rows)=>{
    console.log(rows);
  for (let index = 0; index < rows.length;index++) {
    var lesson = {};
    try{
      lesson.lesson = rows[index];
      id[index] = lesson.lesson.id;
      lesson.lesson.pre = await func_getPreTest(id[index]);
      let data_pre_score = await func_getPreTestScore(id[index],req.params.user_id);
      if(data_pre_score != null){
        let prescore = {};
        prescore.score_number = data_pre_score.score_number;
        prescore.score_total = data_pre_score.score_total;
        prescore.score_past = data_pre_score.score_past;
        lesson.lesson.prescore = prescore;
      }else{
        lesson.lesson.prescore = [];
      }
      
      lesson.lesson.post = await func_getPostTest(id[index]);
      let data_post_score = await func_getPostTestScore(id[index],req.params.user_id);
      if(data_post_score != null){
        let postscore = {};
        postscore.score_number = data_post_score.score_number;
        postscore.score_total = data_post_score.score_total;
        postscore.score_past = data_post_score.score_past;
        lesson.lesson.postscore = postscore;
      }else{
        lesson.lesson.postscore = [];
      }

      lesson.lesson.file = await func_getFileAll(id[index]);
      
      let learn_status = await func_getLearnStatus(id[index],req.params.user_id);
      if(lesson.lesson.pre.pre > 0){
        if(data_pre_score != null){
          if(learn_status == 'pass' || learn_status == 'passtest'){
            if(data_post_score != null){
              lesson.lesson.learn_pass_status = 'pass';
            }else{
              lesson.lesson.learn_pass_status = 'learning';
            }
          }else{
            lesson.lesson.learn_pass_status = learn_status;
          }
        }else{
          lesson.lesson.learn_pass_status = learn_status;
        }
      }else{
        if(learn_status == 'pass' || learn_status == 'passtest'){
            lesson.lesson.learn_pass_status = 'pass';
        }else{
          lesson.lesson.learn_pass_status = learn_status;
        }
      }

      lessonAll.push(lesson)
    }catch(err){
      console.log(err);
    }
      
  }
    
    await res.json(lessonAll)
  })
  lessonAll =[];
})//get router


router.get('/preExam/:id?',async (req, res, next) => {
  let dataAll =[];
    let data = {};
    try{
      let type = 'pre';
      let totalscore = await func_gettotalscore(req.params.id,type);
      data.totalscore = totalscore;
      let totaltime = await func_gettotaltime(req.params.id);
      data.time = totaltime;
      data.lesson_id = req.params.id;
      dataAll.push(data)
    }catch(err){
      console.log(err);
    }    
    await res.json(dataAll)
    dataAll =[];
})//get router

router.get('/postExam/:id?',async (req, res, next) => {
  let dataAll =[];
    let data = {};
    try{
      let type = 'post';
      let totalscore = await func_gettotalscore(req.params.id,type);
      data.totalscore = totalscore;
      let totaltime = await func_gettotaltime(req.params.id);
      data.time = totaltime;
      data.lesson_id = req.params.id;
      dataAll.push(data)
    }catch(err){
      console.log(err);
    }    
    await res.json(dataAll)
    dataAll =[];
})//get router

router.post('/preTest?',async (req, res, next) => {
  let dataAll =[];
    let data = {};
    let user_id = req.body.user_id;
    let lesson_id = req.body.lesson_id;
    let type = req.body.type;
    let questNo = null;
    if(req.body.questNo){
      questNo = req.body.questNo
    }
    let totaltime = await func_gettotaltime(lesson_id);
    try{
      let checkTemp = await func_checkTemp(lesson_id,type,user_id);
      if(checkTemp == null){
        let idx = 1;
        let countchoice = 0;
        let manage = await func_getManage(lesson_id,type);
        for (let index = 0; index < manage.length;index++) {
          let val = manage[index];
          let modelQuestion;
          modelQuestion = await func_getLimitQuestion(val.group_id, val.manage_row);
          for (let index_question = 0; index_question < modelQuestion.length;index_question++) {
            let val_ques = modelQuestion[index_question];
            let temp_test = {};
            temp_test.user_id = user_id;
            temp_test.lesson = lesson_id;
            temp_test.group_id = val_ques['group_id'];
            temp_test.ques_id = val_ques['ques_id'];
            temp_test.type = type;
            temp_test.manage_id = val['manage_id'];
            choice = [];
            let choiceData = await func_getchoice(val_ques['ques_id']);
            arrType4Answer = [];
            Type4Question = [];
            for (let index_choice = 0; index_choice < choiceData.length;index_choice++) {
            // foreach ($choiceData as $key => $val_choice) {
              let val_choice = choiceData[index_choice];
                if(val_choice['choice_type'] != 'dropdown'){
                    choice.push(val_choice['choice_id']);
                }else{
                    if(val_choice['choice_answer'] == 2){
                        arrType4Answer[val_choice['choice_id']] = val_choice['choice_id'];
                    }
                    if(val_choice['choice_answer'] == 1){
                        choice.push(val_choice['choice_id']);
                    }
                }
            }

            if(arrType4Answer.length > 0){
                // ksort($arrType4Answer);
                let choiceA = {};
                // foreach ($arrType4Answer as $key => $arrTypeVal) {
                for (let index_Answere = 0; index_Answere < arrType4Answer.length;index_Answere++) {
                    choiceA.push('"'+arrType4Answer[index_Answere]+'"');
                }
                choice.push(choiceA);
            }
            let str_choice = choice.toString();
            console.log("===========str_choice==============")
            console.log(str_choice);
            temp_test.question = choice;
            temp_test.number = idx++;
            temp_test.status = 0;
            if(index_question==0){
                temp_test.time_start = 'NOW()';
                temp_test.time_up = totaltime*60;
            }else{
                temp_test.time_start = null;
                temp_test.time_up = null;
            }
           let cccc = await func_createTemp(temp_test);//temp_test->save();
           console.log(cccc);
          }
        }
      }
      let sql_number;
      if(questNo != null){
        sql_number = ' AND number = '+questNo;
      } else {
        sql_number = ' AND status="0"';
      }

      let current_temp = await func_getCurrentQuiz(user_id,lesson_id,type,sql_number);
      let lastquiz = 0;
      if(current_temp == null){
        lastquiz = 1;
        current_temp = await func_getCurrentQuiz(user_id,lesson_id,type);
      }
      data.current_temp = current_temp;
      data.question = await func_getQuestionById(current_temp['ques_id']);
      let obj_ans = current_temp['question'];
      console.log(obj_ans);
      // for (let index_choice = 0; index_choice < choiceData.length;index_choice++) {
      //   // foreach ($choiceData as $key => $val_choice) {
      //     let val_choice = choiceData[index_choice];
      //       if(val_choice['choice_type'] != 'dropdown'){
      //           choice.push(val_choice['choice_id']);
      //       }else{
      //           if(val_choice['choice_answer'] == 2){
      //               arrType4Answer[val_choice['choice_id']] = val_choice['choice_id'];
      //           }
      //           if(val_choice['choice_answer'] == 1){
      //               choice.push(val_choice['choice_id']);
      //           }
      //       }
      //   }
      data.tempall = await func_getTempAll(user_id,lesson_id,type);
    }catch(err){
      console.log(err);
    }    
    dataAll.push(data);
    console.log(dataAll)
    await res.json(dataAll)
    dataAll =[];
})//get router


function func_getLearnStatus(lesson_id,user_id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getLearnStatus(lesson_id,user_id, (err,rows)=>{
        if (rows[0] == null) {
          resolve("");
        } else {
          resolve(rows[0].lesson_status);
        }
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getTempAll(user_id,lesson_id,type){
  return new Promise((resolve, reject) => {
    try {
      Lesson.getTempAll(user_id,lesson_id,type, (err,rows)=>{
        resolve(rows);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getQuestionById(ques_id){
  return new Promise((resolve, reject) => {
    try {
      Lesson.getQuestionById(ques_id, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getCurrentQuiz(user_id,lesson_id,type,sql_number = ''){
  return new Promise((resolve, reject) => {
    try {
      console.log('============');
      console.log(sql_number)
      Lesson.getCurrentQuiz(user_id,lesson_id,type,sql_number, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_createTemp(temp_test){
  return new Promise((resolve, reject) => {
    try {
      Lesson.createTemp(temp_test, (err,rows)=>{
        resolve(rows);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getchoice(ques_id){
  return new Promise((resolve, reject) => {
    try {
      Lesson.getchoice(ques_id, (err,rows)=>{
        resolve(rows);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getLimitQuestion(group_id,manage_row){
  return new Promise((resolve, reject) => {
    try {
      Lesson.getLimitQuestion(group_id,manage_row, (err,rows)=>{
        resolve(rows);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getManage(lesson_id,type) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getManage(lesson_id,type, (err,rows)=>{
        resolve(rows);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_checkTemp(lesson_id,type,user_id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.checkTemp(lesson_id,type,user_id, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_gettotaltime(lesson_id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.gettotaltime(lesson_id, (err,rows)=>{
        resolve(rows[0].time_test);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_gettotalscore(lesson_id,type) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.gettotalscore(lesson_id,type, (err,rows)=>{
        resolve(rows[0].totalscore);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getPreTest(id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getPreTest(id, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getPreTestScore(lesson_id,user_id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getPreTestScore(lesson_id,user_id, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}


function func_getPostTestScore(lesson_id,user_id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getPostTestScore(lesson_id,user_id, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

function func_getPostTest(id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getPostTest(id, (err,rows)=>{
        resolve(rows[0]);
     })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}
 
function func_getFileAll(id) {
  return new Promise((resolve, reject) => {
    try {
      Lesson.getFileAll(id, (err,rows)=>{
          resolve(rows);
      })
    } catch (err) {
      reject(new Error('Oops!'));
    }
  });
}

// router.get('/:id?', (req, res, next) => {

//   if (req.params.id) {

//     Lesson.getLessonByID(req.params.id, (err, rows) => {

//       if (err) {
//         res.json(err);
//       } else {
//         res.json(rows);
//       }
//     });
//   } else {
//     console.log('else')
//   }
// });


module.exports = router;