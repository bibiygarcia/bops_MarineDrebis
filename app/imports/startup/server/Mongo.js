import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Samples } from '../../api/stuff/Sample.js';
import { Subsamples } from '../../api/stuff/Subsample.js';
import { Components } from '../../api/stuff/Component.js';

/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}

Meteor.methods({
  'stuffs.claim'(itemId, newOwner) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { status: 'claimed' } });
    Stuffs.collection.update(itemId, { $set: { owner: newOwner } });
  },
});

Meteor.methods({
  'stuffs.release'(itemId) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { status: 'unclaimed' } });
    // currently does not change owner back
  },
});

// newOwner could be provided through a selection menu
Meteor.methods({
  'stuffs.transfer'(itemId, newOwner) {
    // TODO: Add validation and permission checks (they might be allowed to move it)
    Stuffs.collection.update(itemId, { $set: { owner: newOwner } });
  },
});

// TODO: Make this
// Meteor.methods({
//   'stuffs.split'(itemId, quantity) {
//     // TODO: Add validation and permission checks (they might be allowed to move it)
//     Stuffs.collection.add([NEW DOCUMENTS WITH SAME BASE ID]);
//   },
// });

// -----------------------------------------------------------------------------------
//  --------------------------        SAMPLES       ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  linkSamplesWithEvent(eventId, sampleIds) {
    Stuffs.collection.update(eventId, { $addToSet: { sampleIds } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       SUBSAMPLES      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  linkSubamplesWithSamples(sampleId, subsampleIds) {
    Samples.collection.update(sampleId, { $addToSet: { subsampleIds } });
  },
});

// -----------------------------------------------------------------------------------
//  --------------------------       COMPONENTS      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.methods({
  linkComponentWithSubsamples(subsampleId, componentIds) {
    Subsamples.collection.update(subsampleId, { $addToSet: { componentIds } });
  },
});
