import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Debris } from '../../api/debris/Debris';
import { Samples } from '../../api/debris/Sample';
import { Subsamples } from '../../api/debris/Subsample';

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise, publish nothing.
Meteor.publish(Debris.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Debris.collection.find({ owner: username });
  }
  return this.ready();
});

// PUBLICATIONS FOR ADMIN PAGES
// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
Meteor.publish(Debris.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Debris.collection.find();
  }
  return this.ready();
});

Meteor.publish(Debris.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Debris.collection.find({ hasSamples: true });
  }
  return this.ready();
});

// PUBLICATIONS FOR STATUS RELATED PAGES
// check if civilian and if so, don't publish anything
Meteor.publish(Debris.unclaimed, function () {
  if (this.userId) {
    return Debris.collection.find({ status: 'unclaimed' });
  }
  return this.ready();
});

Meteor.publish(Debris.claimed, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Debris.collection.find({ status: 'claimed' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Debris.collection.find({ owner: username, status: 'claimed' });
  }
  return this.ready();
});

Meteor.publish(Debris.stored, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Debris.collection.find({ status: 'stored' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Debris.collection.find({ owner: username, status: 'stored' });
  }
  return this.ready();
});

Meteor.publish(Debris.disposed, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Debris.collection.find({ status: 'disposed' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Debris.collection.find({ owner: username, status: 'disposed' });
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
