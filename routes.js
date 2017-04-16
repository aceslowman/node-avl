var JSX = require('node-jsx').install(),
  React = require('react'),
  AvlApp = require('./components/AvlApp.react'),
  Word = require('./models/Word');

module.exports = {

  index: function(req, res) {
    // Call static model method to get tweets in the db
    Word.getWords(function(words) {

      // Render React to a string, passing in our fetched tweets
      var markup = React.renderComponentToString(
        AvlApp({
          words: words
        })
      );

      // Render our 'home' template
      res.render('home', {
        markup: markup, // Pass rendered react markup
        state: JSON.stringify(words) // Pass current state to client side
      });

    });
  }
}
