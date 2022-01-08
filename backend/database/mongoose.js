const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bintixdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => {
    console.log('connected successfully to mongo');
    // const db = Database.sell("Chat_App"); 
    // users = db.collection("users"); // getting the users collection
    // chatRooms = db.collection("chatRooms"); 
  })
  .catch((e) => {
    console.log('error while connecting to mongoDB');
    console.log(e);
  });


module.exports = {
  mongoose
};