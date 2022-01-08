const passport = require('passport');
const _ = require('lodash');

const User = require('../database/model/user');


module.exports.register = (req,res,next)=>{
    const email=req.body;
User.findOne({email:req.body.email}).exec((err,user)=>{
    if(user){
        return res.status(400).json({ message: 'Email exists.' });
    }
  else{

    const user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.password = req.body.password;
    user.save((err, doc) => {
            if (!err)
            res.send(doc);
            else
                return next(err);
        
            })
  }
})
    
}
   

        
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['username','email', 'phone']) });
        }
    );
}