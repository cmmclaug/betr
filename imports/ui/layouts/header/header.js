import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './header.html';

Template.mainHeader.events({
  // Clicking on the username or avi with jump to profile page
  'click .goProfile' : function(){
    user = Meteor.user().username;
    if( user ) {
      FlowRouter.go('Profile.show', { username: user });
    }
  },
    
  // Set up link back to index on betr logo
  'click .goHome' : function(){
    FlowRouter.go('App.home');
  }
});