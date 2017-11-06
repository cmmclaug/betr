// Define the bet db collection interface and fields

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Override the default db methods
class BetCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
  remove(selector) {
    const bet = this.find(selector).fetch();
    const result = super.remove(selector);
    return result;
  }
}

export const Bets = new BetCollection('bets');

// Deny all client-side updates since we will be using methods to manage this collection
Bets.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// Define schema, mostly for validation
Bets.schema = new SimpleSchema({
   _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  creatorId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  opponentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  arbiterId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  title: {
    type: String,
    max: 50,
  },
  createdAt: {
    type: Date,
  },
  resolutionTime: {
    type: Date,
    // Don't let users pick a resolution time in the past
    custom: function() {
        var myMinDate = new Date(); //today
        if(myMinDate > this.value) {
            return 'minDate';  //Error string according to the docs.
        } else {
            return true;
        }
    },
    optional: true,
  },
  betState: {
    type: String,
    defaultValue: 'Proposed',
  },
  terms: {
    type: String,
    max: 300,
  },
  wager: {
    type: String,
    max: 100,
  },
  winner: {
    type: String,
    defaultValue: 'To be determined',
  },
});

Bets.attachSchema(Bets.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Bets.publicFields = {
  creatorId: 1,
  opponentId: 1,
  arbiterId: 1,
  title: 1,
  state: 1,
  createdAt: 1,
  resolutionTime: 1,
  betDescription: 1,
  wager: 1,
  winner: 1,
};