import { Bets } from '/imports/api/bets/bets.js';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

import './bet.html';

import {
  insert,
} from '/imports/api/bets/methods.js';

Template.viewButton.events({
   // Special template handler for in table routing
  'click .view-button': function () {
    betId = this.item._id;
	console.log( this );
    FlowRouter.go('Bet.show', { _id: betId });
  }
});


Template.bet.onCreated(function () {
	
  Meteor.subscribe('bets.all');
});

Template.bet.helpers({
  bets() {
    return Bets.find({});
  },
  user() {
    return Meteor.user().username;
  },

});

Template.bet.events({
    
  'click .go-to-bet'(event) {
    betId = event.target.getAttribute('name');
    FlowRouter.go('Bet.show', { _id: betId });
  },
    
  'click .new-bet'(event) {
    FlowRouter.go('Bet.add');
  },
});