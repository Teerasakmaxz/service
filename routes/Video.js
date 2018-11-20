var express = require('express');
var router = express.Router();
var Video = require('../models/Video');

router.get('/', function (req, res, next) {
  Video.getVideoAll(function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});


module.exports = router;