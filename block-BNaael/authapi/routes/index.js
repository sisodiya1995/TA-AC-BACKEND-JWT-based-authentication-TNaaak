var express = require('express');
var router = express.Router();
 var auth = require("../middleware/auth")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/protected',auth.verifytoken, function(req, res, next) {
  //console.log(user)
  res.status(200).json({proted :"you are proted route"})
});

router.get('/openroute', function(req, res, next) {
  //console.log(user)
  res.status(200).json({open :"you are open route"})
});
module.exports = router;
