import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Events } from '../../api/debris/Event.js';
import { Samples } from '../../api/debris/Sample.js';
import { Subsamples } from '../../api/debris/Subsample.js';
import { Components } from '../../api/debris/Component.js';

/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Events.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (Events.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}

Meteor.methods({
  'events.claim'(itemId, newOwner) {
    check(itemId, String);
    check(newOwner, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Events.collection.update(itemId, { $set: { status: 'claimed' } });
    Events.collection.update(itemId, { $set: { owner: newOwner } });
    Events.collection.update(itemId, { $set: { claimedAt: Date.now() } });
  },
});

Meteor.methods({
  'events.release'(itemId) {
    check(itemId, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Events.collection.update(itemId, { $set: { status: 'unclaimed' } });
    // currently does not change owner back
  },
});

Meteor.methods({
  'events.store'(itemId) {
    check(itemId, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Events.collection.update(itemId, { $set: { status: 'stored' } });
  },
});

// newOwner could be provided through a selection menu
Meteor.methods({
  'events.transfer'(itemId, newOwner) {
    check(itemId, String);
    check(newOwner, String);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Events.collection.update(itemId, { $set: { owner: newOwner } });
  },
});

Meteor.methods({
  'events.dispose'(itemId, selectedDistribution) {
    check(itemId, String);
    check(selectedDistribution, Number);
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Events.collection.update(itemId, { $set: { status: 'disposed' } });
    Events.collection.update(itemId, { $set: { distribution: selectedDistribution } });
  },
});

// TODO: Make this
// Meteor.methods({
//   'events.split'(itemId, quantity) {
//     // TODO: Add validation and permission checks (they might be allowed to move it)
//     Events.collection.add([NEW DOCUMENTS WITH SAME BASE ID]);
//   },
// });

// -----------------------------------------------------------------------------------
//  --------------------------        SAMPLES       ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  'events.linkSamplesWithEvent'(eventId, sampleIds, protocol = null) {
    check(eventId, String);
    check(sampleIds, [String]);
    protocol && check(protocol, Number);

    const existingEvent = Events.collection.findOne(eventId);
    if (!existingEvent) {
      throw new Meteor.Error('404', 'Event not found: linkSamplesWithEvent');
    }

    Events.collection.update(eventId, { $addToSet: { sampleIds: { $each: sampleIds } } });
    Events.collection.update(eventId, { $set: { hasSamples: true } });
    protocol && Events.collection.update(eventId, { $set: { protocol: protocol } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       SUBSAMPLES      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  'samples.linkSubamplesWithSamples'(sampleId, subsampleIds) {
    check(sampleId, String);
    check(subsampleIds, [String]);

    Events.collection.update(sampleId, { $addToSet: { subsampleIds: { $each: subsampleIds } } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       COMPONENTS      ---------------------------------
// -----------------------------------------------------------------------------------
Meteor.methods({
  'events.linkComponentWithSubsamples'(subsampleId, componentIds) {
    check(subsampleId, String);
    check(componentIds, [String]);

    Events.collection.update(subsampleId, { $addToSet: { componentIds: { $each: componentIds } } });
  },
});
