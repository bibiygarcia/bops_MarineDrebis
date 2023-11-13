import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Debris } from '../../api/debris/Debris.js';
import { Samples } from '../../api/debris/Sample.js';
import { Subsamples } from '../../api/debris/Subsample.js';
import { Components } from '../../api/debris/Component.js';

/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Debris.collection.insert(data);
};

// Initialize the DebrisCollection if empty.
if (Debris.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}

Meteor.methods({
  'Debris.claim'(itemId, newOwner) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Debris.collection.update(itemId, { $set: { status: 'claimed' } });
    Debris.collection.update(itemId, { $set: { owner: newOwner } });
  },
});

Meteor.methods({
  'Debris.release'(itemId) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Debris.collection.update(itemId, { $set: { status: 'unclaimed' } });
    // currently does not change owner back
  },
});

Meteor.methods({
  'Debris.store'(itemId) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Debris.collection.update(itemId, { $set: { status: 'stored' } });
  },
});

// newOwner could be provided through a selection menu
Meteor.methods({
  'Debris.transfer'(itemId, newOwner) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Debris.collection.update(itemId, { $set: { owner: newOwner } });
  },
});

Meteor.methods({
  'Debris.dispose'(itemId) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Debris.collection.update(itemId, { $set: { status: 'disposed' } });
  },
});

// TODO: Make this
// Meteor.methods({
//   'Debris.split'(itemId, quantity) {
//     // TODO: Add validation and permission checks (they might be allowed to move it)
//     Debris.collection.add([NEW DOCUMENTS WITH SAME BASE ID]);
//   },
// });

// -----------------------------------------------------------------------------------
//  --------------------------        SAMPLES       ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  'Debris.linkSamplesWithEvent'(eventId, sampleIds, protocol = null) {
    check(eventId, String);
    check(sampleIds, [String]);
    protocol && check(protocol, Number);

    const existingEvent = Debris.collection.findOne(eventId);
    if (!existingEvent) {
      throw new Meteor.Error('404', 'Event not found: linkSamplesWithEvent');
    }

    Debris.collection.update(eventId, { $addToSet: { sampleIds: { $each: sampleIds } } });
    Debris.collection.update(eventId, { $set: { hasSamples: true } });
    protocol && Debris.collection.update(eventId, { $set: { protocol: protocol } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       SUBSAMPLES      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  'samples.linkSubamplesWithSamples'(sampleId, subsampleIds) {
    check(sampleId, String);
    check(subsampleIds, [String]);

    Debris.collection.update(sampleId, { $addToSet: { subsampleIds: { $each: subsampleIds } } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       COMPONENTS      ---------------------------------
// -----------------------------------------------------------------------------------
Meteor.methods({
  'Debris.linkComponentWithSubsamples'(subsampleId, componentIds) {
    check(subsampleId, String);
    check(componentIds, [String]);

    Debris.collection.update(subsampleId, { $addToSet: { componentIds: { $each: componentIds } } });
  },
});