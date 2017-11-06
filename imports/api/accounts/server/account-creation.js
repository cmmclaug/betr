// Server side accounts API methods

import { Accounts } from 'meteor/accounts-base';

// Manually override the user creation package to add a user profile option
Accounts.onCreateUser(function(options, user) {
    user.profile = options.profile ? options.profile : {};
    //user.profile.picture = "/img/404.svg";

    return user;
});