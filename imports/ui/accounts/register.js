// Register functionality overriden to control validation

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';
import './register.html';

Template.register.events({
    'click #register-button': function(e, t) {
        e.preventDefault();
        // Retrieve the input field values, add username
        let userName = $('#username').val(),
            email = $('#email').val(),
            password = $('#password').val(),
            passwordAgain = $('#password-again').val();

        // Trim Helper
        let trimInput = function(val) {
            return val.replace(/^\s*|\s*$/g, "");
        }
        email = trimInput(email);
        
        // Check username no more than 10 chars
        if( userName.length > 10 ){
            return swal({
                    title: "Username Too Long",
                    text: "No more than 10 characters",
                    showConfirmButton: true,
                    type: "error"
            });
        }

        // Check password is at least 6 chars long
        const isValidPassword = function(pwd, pwd2) {
            if (pwd === pwd2) {
                return pwd.length >= 6 ? true : false;
            } else {
                return swal({
                    title: "Passwords don't match",
                    text: "Please try again",
                    showConfirmButton: true,
                    type: "error"
                });
            }
        }

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        if (isValidPassword(password, passwordAgain)) { 
            Accounts.createUser({
                username: userName,
                email: email,
                password: password
            }, function(error) {
                if (error) {
                    return swal({
                    title: error.reason,
                    text: "Please try again",
                    showConfirmButton: true,
                    type: "error"
                });
                } else {
                    FlowRouter.go('/');
                }
            });
        }

        return false;
    }
});