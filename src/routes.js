// var JSX = require('node-jsx').install(),
//   React = require('react'),
//   AvlApp = require('./components/AvlApp.react'),
//   Word = require('./models/Word');
//
// module.exports = {
//   index: function(req, res) {
//
//     Word.getWords(function(words) {
//       var markup = React.renderComponentToString(
//         AvlApp({
//           words: words
//         })
//       );
//
//       console.log(words);
//
//       res.render('home', {
//         markup: markup, // Pass rendered react markup
//         // markup: words,
//         state: JSON.stringify(words) // Pass current state to client side
//       });
//     });
//   }
// }

import React from 'react';
import { Router, IndexRoute } from 'react-router';
import Layout from './components/Layout';

const routes = (
  <Router path="/" component={Layout}>
  </Router>
);

export default routes;
