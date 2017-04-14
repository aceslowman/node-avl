const fs = require('fs');

var graphemes;

fs.readFile('english_graphemes.json', 'utf8', function (err, data) {
  if (err){
    console.log(err);
  };
  graphemes = JSON.parse(data);

  var lineReader = require('readline').createInterface({
    input: fs.createReadStream("/usr/share/dict/words")
  });

  lineReader.on('line', function (line) {
    var word_obj = {"word":line};
    word_obj.graphemes = [];
    for(var key in graphemes){
      var regexp = new RegExp(key, "g");
      while ((key = regexp.exec(line)) != null) {
        word_obj.graphemes.push(
          {
            "index":key["index"],
            "grapheme":key[0],
            "phonemes":graphemes[key]
          });
      }
    }

    word_obj.graphemes.sort(function (a, b) {
      return a.index - b.index;
    });

    console.log(JSON.stringify(word_obj,undefined,2));
  });
});
