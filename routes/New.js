var express = require('express');
var router = express.Router();
var New = require('../models/New');

router.get('/:id?', function (req, res, next) {

  if (req.params.id) {

    New.getNewById(req.params.id, function (err, rows) {

      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else {

    New.getAllNews(function (err, rows) {

      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }


    });
  }
});
router.post('/', function (req, res, next) {
  console.log(req.body)

  New.addNew(req.body, function (err, count) {
    if (err) {
      res.json(err);
    } else {
      res.json(req.body); //or return count for 1 &amp;amp;amp; 0
    }
  });
});
router.delete('/:id', function (req, res, next) {

  New.deleteNew(req.params.id, function (err, count) {

    if (err) {
      res.json(err);
    } else {
      res.json(count);
    }

  });
});
router.put('/:id', function (req, res, next) {

  New.updateNew(req.params.id, req.body, function (err, rows) {

    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});
module.exports = router;