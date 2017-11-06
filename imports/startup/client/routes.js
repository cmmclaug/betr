import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/app-body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home', registerState: false, newBet: false, showBet: false, showProfile: false });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home', registerState: false, newBet: false, showBet: false, showProfile: false });
  }
});

FlowRouter.route('/register', {
  name: 'register',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home',  registerState: true, newBet: false, showBet: false, showProfile: false });
  }
});

FlowRouter.route('/new-bet', {
  name: 'Bet.add',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home', registerState: false, newBet: true, showBet: false, showProfile: false });
  },
});

// Use unique id to view bet info page
FlowRouter.route('/bet/:_id', {
  name: 'Bet.show',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home', registerState: false, newBet: false, showBet: true, showProfile: false });
  },
});

FlowRouter.route('/profile/:username', {
  name: 'Profile.show',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home', registerState: false, newBet: false, showBet: false, showProfile: true });
  },
});

// Default page not found error handler
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
