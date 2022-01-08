const express = require('express')
const {mongoose} = require('./database/mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/user');
require('./config/config');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
const MongoStore = require('connect-mongo');

app.use(session({
  name:'myname.sid',
  resave:false,
  secret:'secret',
  saveUninitialized:false,
  cookie:{
      maxAge:36000000,
      httpOnly:false,
      secure:false
  },
  store: MongoStore.create({
      mongooseConnection: mongoose.connection,
      mongoUrl: 'mongodb://localhost:27017/bintixdb'
    })
}));


require('./passport-config')
app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
      var valErrors = [];
      Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
      res.status(422).send(valErrors)
  }
  
})

app.use('/api', userRoute);

// app.get('/', (req,res)=>{
//    res.send('It is working')
// })

app.listen(3000, ()=>{
   console.log('app run on 3000');
   
})