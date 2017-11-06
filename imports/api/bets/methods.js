// Define API methods to interact with bets collection

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Bets } from './bets.js';

// Create a new bet
export const insert = new ValidatedMethod({
  name: 'bets.insert',
  validate: Bets.simpleSchema().pick(['creatorId', 'opponentId','title','terms','wager', 'resolutionTime']).validator({ clean: true, filter: false }),
  run({ creatorId, opponentId, title, terms, wager, resolutionTime }) {
      
    const bet = {
      creatorId,
      opponentId,
      title,
      terms,
      wager,
      createdAt: new Date(),
      resolutionTime,
      betState: 'Proposed',
    };

    Bets.insert( bet, (error) => {
        if( error ) {
            console.log(error);
        }
    });
  },
});


export const update = new ValidatedMethod({
  name: 'bets.update',
  validate: null,
  // Validator method is fickly, will fix later
  //validate: Bets.simpleSchema().pick(['creatorId', 'opponentId','title','terms','wager', 'resolutionTime']).validator({ clean: true, filter: false }),
  run({ betId, creatorId, opponentId, title, terms, wager, resolutionTime }) {
	  
    const bet = Bets.findOne(betId);
    
    // Make sure only this user or the challenger can update
    if( ( bet.creatorId === this.userId ) || ( bet.opponentId === this.userId ) ) {
		Bets.update(betId, {
			$set: { creatorId: creatorId,
			        opponentId: opponentId,
					title: title,
					terms: terms,
					wager: wager,
					resolutionTime: resolutionTime,
			}
		});
	}
				
	else{
	  throw new Meteor.Error('Bets.update.accessDenied',
        'Cannot update a bet you are not involved in');
	}


  },
});

// Update only the betState field
export const updateBetState = new ValidatedMethod({
  name: 'bets.updateBetState',
  validate: null,
  // Validator method is fickle, will fix later
  //validate: Bets.simpleSchema().pick(['betState']).validator({ clean: true, filter: false }),
  run({ betId, betState }) {
	  
    const bet = Bets.findOne(betId);

    if( ( bet.creatorId === this.userId ) || ( bet.opponentId === this.userId ) ) {
		Bets.update(betId, {
			$set: { betState: betState
		}
	  });
	}
				
	else{
	  throw new Meteor.Error('Bets.updateBetState.accessDenied',
        'Cannot update a bet you are not involved in');
	}


  },
});

// Remove bets, only if we are involved
export const remove = new ValidatedMethod({
  name: 'bets.remove',
  validate: null,
  run({ betId }) {
    const bet = Bets.findOne(betId);
	
	if( ( bet.creatorId === this.userId ) || ( bet.opponentId === this.userId ) ) {
		Bets.remove(betId);
	}
	else{
	  throw new Meteor.Error('Bets.remove.accessDenied',
        'Cannot remove a bet you are not involved in');
	}
  },
}); 

// Get list of all method names on Bets
const BET_METHODS = _.pluck([
  insert,
  update,
  updateBetState,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 bet operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(BET_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}