// All bets-related publications

import { Meteor } from 'meteor/meteor';
import { Bets } from '../bets.js';

// Publish all bet info
Meteor.publish('bets.all', function () {
  return Bets.find();
});