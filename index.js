const fs = require('fs');
const mongoose = require('mongoose');
var Word = require('./models/Word');

mongoose.connect('mongodb://localhost/avl');

//intialize db (AVL)
var db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error: "));

db.once('open',function(){
  console.log("Connected successfully to MongoDB");

  Word.populate();
});
//
// var repopulate = function(){
//   //set up a new schema
//   var wordSchema = mongoose.Schema({
//     word: String,
//     breakdown: [
//       {
//         index: Number,
//         grapheme: String,
//         phonemes: [String]
//       }
//     ]
//   });
//   //set up a new model
//   var Word = mongoose.model('Word', wordSchema);
//
//   var breakdown,
//       words;
//
//   Word.remove({}, function (err) {
//     if (err) return handleError(err);
//     console.log("removed");
//   });
//
//   fs.readFile('assets/english_graphemes.json', 'utf8', function (err, data) {
//     if (err){ console.log(err) };
//
//     graphemes = JSON.parse(data);
//
//     var lineReader = require('readline').createInterface({
//    // input: fs.createReadStream("/usr/share/dict/words")
//       input: fs.createReadStream("assets/afewwords")
//     });
//
//     lineReader.on('line', function (line) {
//       var word_obj = {"word":line};
//
//       word_obj.breakdown = [];
//       for(var key in graphemes){
//         var regexp = new RegExp(key, "g");
//         while ((key = regexp.exec(line)) != null) {
//           word_obj.breakdown.push(
//             {
//               "index":key["index"],
//               "grapheme":key[0],
//               "phonemes":graphemes[key]
//             });
//         }
//       }
//
//       word_obj.breakdown.sort(function (a, b) {
//         return a.index - b.index;
//       });
//
//       // console.log(JSON.stringify(word,undefined,2));
//       var word = new Word(word_obj);
//       var promise = new Promise(function(resolve, reject) {
//         console.log(word);
//         word.save(function (err, word) {
//           if (err){
//             reject(Error("Save error: " + err));
//           }else{
//             resolve("Word Saved to DB!");
//           }
//         });
//       });
//       promise.then(function(result) {
//         console.log(result);
//       }, function(err) {
//         console.log(err);
//       });
//     });
//
//     Word.find({},function(err,word){
//       if(err){
//         console.log(err);
//       }else{
//         console.log(word);
//       }
//     });
//   });
// }
