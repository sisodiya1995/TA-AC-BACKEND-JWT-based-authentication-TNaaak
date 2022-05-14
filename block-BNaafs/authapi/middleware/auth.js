var jwt = require('jsonwebtoken')

module.exports = {
    verifytoken : async (req ,res ,next) =>{
     var token = req.headers.authorization;
      try {

       if(token){
        var payload = await jwt.verify(token ,"thisissecret")
        req.user = payload ;
        next()
       } else{
           return res.status(400).json({error : "token required"})
       }

      } catch(error) {
        return next(error)

      }

    }

}