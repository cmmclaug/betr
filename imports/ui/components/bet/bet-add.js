import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import { Bets } from '/imports/api/bets/bets.js';

// Declare server API db methods
import {
  insert,
} from '/imports/api/bets/methods.js';

import './bet-add.html';

Template.bet_add.onCreated(function betAddPageOnCreated() {

  // Var to track which opponent selected
  this.opponentSelect = new ReactiveVar(false);

  // Need access to all subscriptions
  this.autorun(() => {
    this.subscribe('bets.all');
    this.subscribe('users.all');
  });
});

Template.bet_add.onRendered(function betAddPageOnRendered() {
    this.$('.datetimepicker').datetimepicker();
});

Template.bet_add.helpers({
    
  users() {
    return Meteor.users.find({});
  },
  
  opponentSelect() {
	return Template.instance().opponentSelect.get();
  }
    
});

Template.bet_add.events({
  'change .opponent'(event, instance) {
	const target = event.target;
	// Update opponent select for avi update
	instance.opponentSelect.set(target.options[target.selectedIndex].value);
  },
	
  'submit .bet-add-info'(event) {

    event.preventDefault();

	// Read form data to submit as new bet
    const target = event.target;
    const title = target.title;
    const opponent = target.opponent.value;
    const terms = target.terms;
    const wager = target.wager;
      
    const picker = $( '.datetimepicker' );
    const resolutionTime = picker.data( 'DateTimePicker' ).date().toDate();
	
    if( opponent === Meteor.user()._id ){
	  swal({
         title: "Don't bet against yourself",
            text: "First rule of fight club...",
            timer: 1700,
            showConfirmButton: false,
            type: "error"
      });
	}
	else {
      insert.call({
        creatorId: Meteor.user()._id,
        opponentId: opponent,
        title: title.value,
        terms: terms.value,
        wager: wager.value,
        resolutionTime: resolutionTime
      }, (error) => {
      if (error) {
        console.log(error.Message);
        return swal({
            title: "Error Submitting Bet",
            text: error.error,
            timer: 1700,
            showConfirmButton: false,
            type: "error"
         });
      }
      else {
		swal({
            title: "Bet Created!",
            timer: 2000,
            showConfirmButton: true,
            type: "success"
         });  
		  
        FlowRouter.go('App.home');
      }
     });
	}
  },
    
  'click .cancel-button'(event) {
    event.preventDefault();
      
    FlowRouter.go('App.home');
  },
});