import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

/* eslint-disable no-console */

const createUser = (username, email, password, role) => {
  console.log(`  Creating user ${email}.`);
  const userID = Accounts.createUser({
    username: username,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  } else if (role === 'org') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'org');
  }
};

const createUserOrganization = (username, organization, email, password, role) => {
  console.log(`  Creating user ${email}.`);
  const userID = Accounts.createUser({
    username: username,
    organization: organization,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, role);
  } else {
    Roles.createRole('org', { unlessExists: true });
    Roles.addUsersToRoles(userID, 'org');
  }
};

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts && Meteor.settings.defaultAccountsOrganizations) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.forEach(({ username, email, password, role }) => createUser(username, email, password, role));
    Meteor.settings.defaultAccountsOrganizations.forEach(({ username, organization, email, password, role }) => createUserOrganization(username, organization, email, password, role));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
