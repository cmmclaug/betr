// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Bets } from '../../api/bets/bets.js';

Meteor.startup(() => {

  /* Will be formalized later with tests, load manually for now
  // if the Bets collection is empty
  if (Bets.find().count() === 0) {
    const randomUser = Meteor.users.findOne({});
    const data = [
      {
        creatorId: randomUser._id,
        opponentId: randomUser._id,
        title: 'firstBet!',
        terms: 'Heads I win, tales you lose',
        wager: 'All your base',
        createdAt: new Date(),
      },
    ];

    data.forEach(bet => Bets.insert(bet));
  } */

});
