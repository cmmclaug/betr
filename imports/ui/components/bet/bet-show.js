import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Bets } from '/imports/api/bets/bets.js';

// Import server API methods
import {
  update,
  updateBetState,
  remove,
} from '/imports/api/bets/methods.js';

import './bet-show.html';


Template.bet_show.onCreated(function betShowPageOnCreated() {
	
  // Var to let us know if data is being modified
  this.isModified = new ReactiveVar(false);
  this.getBetId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('bets.all');
  });
});

Template.bet_show.onRendered(function betShowPageOnRendered() {
    $('.datetimepicker').datetimepicker();
});

Template.bet_show.helpers({
    
  bet() {
    const instance = Template.instance();
    const betId = instance.getBetId();
    return [Bets.findOne(betId)];
  },
      
  betIdArray() {
    const instance = Template.instance();
    const betId = instance.getBetId();
    if( Bets.findOne(betId)){
        return [betId];
    }
    return [];
  },
  creatorName() {
      return Meteor.users.findOne({_id: this.creatorId}).username;
  },
  opponentName() {
      return Meteor.users.findOne({_id: this.opponentId}).username;
  },
  isModified() {
	return Template.instance().isModified.get();
  },
  isAccepted() {
	  if( this.betState === 'Accepted' )
		  return true;
	  else {
		return false;
	  }
  },
  isNotCompleted() {
    const pattern = new RegExp("wins", 'i');
    if(this.betState.match(pattern)){                            
      return false;
	}
	else{
	 return true;
	}
  },
  
});

Template.bet_show.events({
	
	'click .accept-button'(event) {
    event.preventDefault();
	
	// Only allow acceptance by the opponent
	if( this.opponentId === Meteor.user()._id ) {
	  updateBetState.call({
         betId: this._id,
		 betState: "Accepted",
     }, (error) => {
       if (error) {
         console.log(error.Message);
         return swal({
            title: "Error Accepting Bet",
            text: error.error,
            timer: 1700,
            showConfirmButton: false,
            type: "error"
         });
       }
	   else{
		 swal({
            title: "Bet Accepted!",
            timer: 2000,
            showConfirmButton: true,
            type: "success"
         });
	   }
	});
	}
	else{
	  return swal({
            title: "Not Accepted!",
            text: "Only the opponent can accept!",
            showConfirmButton: true,
            type: "error"
       });
	}
  },
  
  'submit .bet-modify-info'(event) {
    event.preventDefault();
	
	const target = event.target;

    const terms = target.newterms;
    const wager = target.newwager;
	
	// Disallow resolution time update for now, something buggy about picker
	const resolutionTime = this.resolutionTime;
	
	// Update bet with new data, need validation here as well
	// Notice that the creator and opponent swap
	update.call({
        betId: this._id,
		creatorId: this.opponentId,
        opponentId: this.creatorId,
        title: this.title,
        terms: terms.value,
        wager: wager.value,
        resolutionTime: resolutionTime
		
    }, (error) => {
      if (error) {
		console.log(error.error);
        console.log(error.Message);
        return swal({
            title: "Error Updating Bet",
            text: error.error,
            timer: 1700,
            showConfirmButton: false,
            type: "error"
         });
       }
	   else {
	   
	   swal({
            title: "Bet Updated!",
            timer: 2000,
            showConfirmButton: false,
            type: "success"
         });
	   }	   
	});
	
	// Reload bet and turn off modification options
    Template.instance().isModified.set(false);
    FlowRouter.go('Bet.show', { _id: this._id });
  },
  
  'click .modify-button'(event) {
    event.preventDefault();
	Template.instance().isModified.set(true);
  },
  'click .unedit-button'(event) {
    event.preventDefault();

	Template.instance().isModified.set(false);
    FlowRouter.go('Bet.show', { _id: this._id });

  },
  
  'click .concede-button'(event) {
    event.preventDefault();
	
	let winnerName = " Wins!";
	let otherUser = "";
	
	// This could be more stylish, but concede and declare the opponent the winner
	if( this.creatorId === Meteor.user()._id ) {
		otherUser = Meteor.users.findOne({_id: this.opponentId}).username;
	}
	else {
		otherUser = Meteor.users.findOne({_id: this.creatorId}).username;
	}
	
	winnerName = otherUser + winnerName;
    
    updateBetState.call({
        betId: this._id,
		betState: winnerName,
    }, (error) => {
      if (error) {
        console.log(error.Message);
        return swal({
            title: "Error Accepting Bet",
            text: error.error,
            timer: 2000,
            showConfirmButton: false,
            type: "error"
         });
       }
	   else{
		 swal({
            title: "You Lost!",
			text: "Better luck next time",
            showConfirmButton: true,
            type: "success"
         });
	   }
	});
	flowRouter.go("App.home");
  },
	
  'click .delete-button'(event) {
    event.preventDefault();
	
	// Need validation client side as well, delete bet
	 remove.call({
        betId: this._id,
    }, (error) => {
      if (error) {
        console.log(error.Message);
        return swal({
            title: "Error Deleting Bet",
            text: error.error,
            timer: 2000,
            showConfirmButton: false,
            type: "error"
         });
        }
      else {
		swal({
            title: "Bet Deleted!",
            showConfirmButton: true,
            type: "success"
         });
		  
        FlowRouter.go('App.home');
      }
	});
  },
	
});