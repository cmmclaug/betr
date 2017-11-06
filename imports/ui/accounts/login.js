import { FlowRouter } from 'meteor/kadira:flow-router';
import './login.html';

Template.login.events({
    'click #login-button': function(e, t) {
        e.preventDefault();
        const user = $('#login-user').val(),
              password = $('#login-password').val();

        Meteor.loginWithPassword(user, password, function(error) {
            if (error) {
                return swal({
                    title: "Username or password incorrect",
                    text: "Please try again or create an account",
                    timer: 1700,
                    showConfirmButton: false,
                    type: "error"
                });
            } else {
                FlowRouter.go('/');
            }
        });
        return false;
    }
});