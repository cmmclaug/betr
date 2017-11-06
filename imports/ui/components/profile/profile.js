import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
import '../../../api/accounts/methods.js'

import './profile.html';

Template.profile.helpers({

  picture() {
    return Meteor.user().profile.picture;
  },

});

Template.profile.events({
	
	// Launch camera UI and update
    'click .update-button': function(event) {
    event.preventDefault();

    const target = event.target;
    console.log('updating picture');
	
	// Get 160x160 image from device camera as data
    MeteorCameraUI.getPicture({ width: 160, height: 160 }, (err, data) => {
      if(err)
      {
        console.log(err);
        if( err.error == 'cancel') return;
        else{
          return swal({
            title: "Error updating profile picture",
            text: "Please confirm your device has a camera enabled",
            timer: 1700,
            showConfirmButton: false,
            type: "error"
         });
        }
      }
        
	  // Load image data into user profile db
      Meteor.call( 'updatePicture', data, (err) => {
        if(err)
        {
          if( err.error == 'cancel') return;
             else{
              return swal({
                title: "Error updating profile picture",
                text: "Error saving new picture to profile",
                timer: 1700,
                showConfirmButton: false,
                type: "error"
           });
          }
        }
      });
    });
  },
	
  'click .logout-button'(event) {
    event.preventDefault();

    Meteor.logout();
  },
  
  'click .home-button'(event) {
    event.preventDefault();

    FlowRouter.go('App.home');
  },
    
});
