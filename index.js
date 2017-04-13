// file = (string) filepath of the file to read

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream("/usr/share/dict/words")
});

lineReader.on('line', function (line) {
  //everything this returns is a word
  
  console.log('Line from file:', line);
});
