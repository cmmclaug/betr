// Extending accounts methods

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    
  // Update the profile picture value in db with data if this user
  updatePicture(data) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update picture.');
    }

    check(data, String);

    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
  },
});