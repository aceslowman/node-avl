const fs = require('fs'),
    mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = mongoose.Schema({
  word: String,
  breakdown: [
    {
      index: Number,
      grapheme: String,
      phonemes: [String]
    }
  ]
});

schema.statics.populate = function(callback){
    //set up a new model
    var Word = mongoose.model('Word', schema);

    var breakdown,
        words;

    Word.remove({}, function (err) {
      if (err) return handleError(err);
      // console.log("removed");
    });

    fs.readFile('assets/english_graphemes.json', 'utf8', function (err, data) {
      if (err){ console.log(err) };

      graphemes = JSON.parse(data);

      var lineReader = require('readline').createInterface({
     // input: fs.createReadStream("/usr/share/dict/words")
        input: fs.createReadStream("assets/afewwords")
      });

      lineReader.on('line', function (line) {
        var word_obj = {"word":line};

        word_obj.breakdown = [];
        for(var key in graphemes){
          var regexp = new RegExp(key, "g");
          while ((key = regexp.exec(line)) != null) {
            word_obj.breakdown.push(
              {
                "index":key["index"],
                "grapheme":key[0],
                "phonemes":graphemes[key]
              });
          }
        }

        word_obj.breakdown.sort(function (a, b) {
          return a.index - b.index;
        });

        // console.log(JSON.stringify(word,undefined,2));
        var word = new Word(word_obj);
        var promise = new Promise(function(resolve, reject) {
          word.save(function (err, word) {
            if (err){
              reject(Error("Save error: " + err));
            }else{
              resolve("Word Saved to DB!");
            }
          });
        });
        promise.then(function(result) {
          schema.statics.getWords();
        }, function(err) {
          console.log(err);
        });
      });
    });
}

schema.statics.getWords = function(callback){
  var words = [];

  Word.find({},function(err,docs){
    if(!err){
      words = docs;
      // console.log(words);
      callback(words);
    }else{
      console.log(err);
    }
  });
}

// Return a Tweet model based upon the defined schema
module.exports = Word = mongoose.model('Word', schema);
