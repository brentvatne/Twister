/**
 * This is the entry point for your experience that you will run on Exponent.
 */
'use strict';

import Exponent from 'exponent';
let React = require('react-native');
let {
  AppRegistry,
} = React;

// if (StatusBarIOS) {
//   StatusBarIOS.setHidden(true);
// }

let TwisterScreen = require('TwisterScreen');

AppRegistry.registerComponent('main', () => TwisterScreen);
