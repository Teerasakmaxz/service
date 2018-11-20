var express = require('express');
var router = express.Router();
var Learn = require('../models/Learn')
var fs = require('fs')

var learnnAll =[];
router.get('/getLearn/:id/:user_id?',async(req,res)=>{
    var learn = {};
    try{
      //learn.lesson = rows[index];
      //id[index] = lesson.lesson.id;
      learn.type = await func_getType(req.params.id);
      if(learn.type == 'vdo'){

      learn.learn = await func_getLearn(req.params.id);
      
      learn.image = await func_getImage(req.params.id);
      }else{
        learn.learn = [];
        learn.image = await func_getImagePdf(req.params.id);
      }
      let learn_id = await func_getLearnId(req.params.id,req.params.user_id);
      if(learn_id != null){
        learn.last = await func_getLastSlide(learn_id,learn.image[0].file_id,req.params.user_id);
      }else{
        learn.last = [];
      }
      learn.lesson_id = req.params.id;
      learnnAll.push(learn);

    }catch(err){
      console.log(err);
    }
    await res.json(learnnAll)
    learnnAll =[];
});

router.post('/learnfile', async(req, res, next) =>{
    let checklearn =  await func_getLearnId(req.body.lesson_id,req.body.user_id);
    let learn_id;
    let checklearnfile;
    let data =[];
    if(checklearn == null){// ถ้ายังไม่มีให้ insert record ใหม่
        let course_id = await func_getCourseId(req.body.lesson_id);
        learn_id = await func_addLearn(req.body.lesson_id,req.body.user_id,course_id);
        await func_addLearnfile(learn_id,req.body.user_id,req.body.file_id,req.body.status);
    }else{ // ถ้ามีแล้วให้ update ข้อมูลเดิม
        learn_id = checklearn;
        checklearnfile =  await func_checkLearnfile(checklearn,req.body.user_id,req.body.file_id);
        if(checklearnfile == null){// ถ้ายังไม่มีให้ insert record ใหม่
            await func_addLearnfile(checklearn,req.body.user_id,req.body.file_id,req.body.status);
        }else{ // ถ้ามีแล้วให้ update ข้อมูลเดิม
            await func_updateLearnfile(checklearn,req.body.user_id,req.body.file_id,req.body.status);
        }
    }

    let count_learn_file_all = await func_count_learn_file_all(req.body.lesson_id);
    let count_learn_file_success = await func_count_learn_file_success(learn_id,req.body.user_id,req.body.file_id,req.body.status);
    let learn_status;
    if(count_learn_file_success != count_learn_file_all){
        learn_status = 'learning';
    }else{
        learn_status = 'pass';
    }
    await func_update_learn_status(learn_id,learn_status);
    data.push({'status':learn_status});
    await res.json(data);
    data = [];
});

function func_getCourseId(lesson_id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getCourseId(lesson_id, (err,rows)=>{
            if(rows.length != 0){
                resolve(rows[0].course_id);
            }else{
                resolve(null);
            }
          
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
}

function func_update_learn_status(learn_id,learn_status) {
    return new Promise((resolve, reject) => {
        try {
        Learn.update_learn_status(learn_id,learn_status, (err,rows)=>{
            resolve(true);
        })
        } catch (err) {
        reject(new Error('Oops!'));
        }
    });
}

function func_count_learn_file_all(lesson_id) {
    return new Promise((resolve, reject) => {
        try {
        Learn.count_learn_file_all(lesson_id, (err,rows)=>{
            resolve(rows[0].count_file);
        })
        } catch (err) {
        reject(new Error('Oops!'));
        }
    });
}

function func_count_learn_file_success(learn_id,user_id,file_id) {
    return new Promise((resolve, reject) => {
        try {
        Learn.count_learn_file_success(learn_id,user_id,file_id, (err,rows)=>{
            resolve(rows[0].count_file);
        })
        } catch (err) {
        reject(new Error('Oops!'));
        }
    });
}

function func_addLearn(lesson_id,user_id,course_id) {
    return new Promise((resolve, reject) => {
        try {
        Learn.addLearn(lesson_id,user_id,course_id, (err,rows)=>{
            resolve(rows.insertId);
        })
        } catch (err) {
        reject(new Error('Oops!'));
        }
    });
}

function func_addLearnfile(learn_id,user_id,file_id,status) {
    return new Promise((resolve, reject) => {
        try {
        Learn.addLearnfile(learn_id,user_id,file_id,status, (err,rows)=>{
            resolve(true);
        })
        } catch (err) {
        reject(new Error('Oops!'));
        }
    });
}

function func_updateLearnfile(learn_id,user_id,file_id,status) {
    return new Promise((resolve, reject) => {
        try {
        Learn.updateLearnfile(learn_id,user_id,file_id,status, (err,rows)=>{
            resolve(true);
        })
        } catch (err) {
        reject(new Error('Oops!'));
        }
    });
}

function func_checkLearnfile(learn_id,user_id,file_id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.checkLearnfile(learn_id,user_id,file_id, (err,rows)=>{
            if(rows.length != 0){
                resolve(rows[0].learn_file_id);
            }else{
                resolve(null);
            }
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
}

function func_getLearnId(id,user_id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getLearnId(id,user_id, (err,rows)=>{
            if(rows.length != 0){
                resolve(rows[0].learn_id);
            }else{
                resolve(null);
            }
          
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
}

function func_getLastSlide(learn_id,file_id,user_id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getLastSlide(learn_id,file_id,user_id, (err,rows)=>{
            if(rows.length != 0){
                resolve(rows[0].learn_file_status);
            }else{
                resolve([]);
            }
          
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
}

  function func_getLearn(id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getLearn(id, (err,rows)=>{
          resolve(rows);
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
  }


  function func_getImage(id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getImage(id, (err,rows)=>{
          resolve(rows);
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
  }
  
  function func_getImagePdf(id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getImagePdf(id, (err,rows)=>{
          resolve(rows);
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
  }

  function func_getType(id) {
    return new Promise((resolve, reject) => {
      try {
        Learn.getType(id, (err,rows)=>{
          resolve(rows[0].type);
       })
      } catch (err) {
        reject(new Error('Oops!'));
      }
    });
  }
module.exports = router;