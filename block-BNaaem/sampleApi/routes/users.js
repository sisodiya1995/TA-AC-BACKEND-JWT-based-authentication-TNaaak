var express = require('express');
var router = express.Router();
var User = require("../modals/user");
var bcrypt = require("bcryptjs");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async (req, res, next) => {
  
  try {
    var user = await User.create(req.body);
    var token = await user.SignToken()
    res.status(200).json({user : user.userJson(token)});
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: " email/passsword are required" });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: " email is  not correct" });
    }

    var result = await user.verifyPassword(password);
    console.log(result);
    if (!result) {
      return res.status(401).json({ error: " password  is not  correct" });
    }

    // grnerate token
    var token = await user.SignToken()
    return res.status(200).json({user :user.userJson(token)})

  } catch (error) {
    return next(error);
  }
});


module.exports = router;
