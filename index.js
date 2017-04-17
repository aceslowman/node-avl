const fs = require('fs');
const mongoose = require('mongoose');
var Word = require('./models/Word');

mongoose.connect('mongodb://localhost/avl');

//intialize db (AVL)
var db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error: "));

db.once('open',function(){
  console.log("Connected successfully to MongoDB");
  // Word.populate();
});

Word.getWords();
