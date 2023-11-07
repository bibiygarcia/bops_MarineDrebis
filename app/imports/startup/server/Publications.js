import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Samples } from '../../api/stuff/Sample';
import { Subsamples } from '../../api/stuff/Subsample';

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise, publish nothing.
Meteor.publish(Stuffs.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username });
  }
  return this.ready();
});

// PUBLICATIONS FOR ADMIN PAGES
// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
Meteor.publish(Stuffs.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.collection.find();
  }
  return this.ready();
});

Meteor.publish(Stuffs.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.collection.find({ hasSamples: true });
  }
  return this.ready();
});

// PUBLICATIONS FOR STATUS RELATED PAGES
// check if civilian and if so, don't publish anything
Meteor.publish(Stuffs.unclaimed, function () {
  if (this.userId) {
    return Stuffs.collection.find({ status: 'unclaimed' });
  }
  return this.ready();
});

Meteor.publish(Stuffs.claimed, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Stuffs.collection.find({ status: 'claimed' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username, status: 'claimed' });
  }
  return this.ready();
});

Meteor.publish(Stuffs.stored, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Stuffs.collection.find({ status: 'stored' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username, status: 'stored' });
  }
  return this.ready();
});

Meteor.publish(Stuffs.disposed, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Stuffs.collection.find({ status: 'disposed' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.collection.find({ owner: username, status: 'disposed' });
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});

// -----------------------------------------------------------------------------------
//  --------------------------        SAMPLES       ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.publish(Samples.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Samples.collection.find();
  }
  return this.ready();
});

// -----------------------------------------------------------------------------------
//  --------------------------       SUBSAMPLES      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.publish(Subsamples.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Subsamples.collection.find();
  }
  return this.ready();
});
