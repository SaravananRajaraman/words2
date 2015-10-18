var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });

});

router.get('/signIn', function(req, res, next) {
    res.render('login');
});

router.get('/words', function(req, res, next) {
    res.render('words');
});

module.exports = router;
