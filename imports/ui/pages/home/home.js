import { Meteor } from 'meteor/meteor';
import { betRenderHold } from '../launch/launch-screen.js';

import './home.html';

import '../../layouts/header/header.js';

import '../../accounts/login.js'
import '../../accounts/register.js'

import '../../components/bet/bet.js';
import '../../components/bet/bet-add.js';
import '../../components/bet/bet-show.js';
import '../../components/profile/profile.js';

Template.App_home.onCreated(function homePageOnCreated() {
   
  // Retrieve all published data from db
  this.autorun(() => {
    this.subscribe('bets.all');
    this.subscribe('users.all');
  });
});

Template.App_home.onRendered(function homePageOnRendered() {
  // Hold loading screen until all subscriptions are ready
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      betRenderHold.release();
    }
  });
});