// All accounts-related publications

import { Meteor } from 'meteor/meteor';

// By default only the current User info is published
Meteor.publish('users.all', function () {
  return Meteor.users.find({}, {fields:{ _id: true, username: true, createdAt: true, profile: true }});
});