const mongoose  = require('mongoose');
const bcrypt  = require('bcryptjs');
const passportLM = require('passport-local-mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String
    },
    password:{
        type:String
    },
    saltSecret: String

});

userSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(this.password, salt, (err,hash)=>{
          this.password = hash;
          this.saltSecret = salt;
          next()
      });
    });
}
);
// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.'
);
// userSchema.pre('save', function(){
    
// })

// Passport js and jwt
userSchema.methods.isValid = function(hashedpassowrd){
    return bcrypt.compareSync(hashedpassowrd, this.password)
}
userSchema.plugin(passportLM);

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}
module.exports = mongoose.model('User', userSchema);