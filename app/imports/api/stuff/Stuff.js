import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The StuffsCollection. It encapsulates state and variable values for stuff.
 */
class StuffsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'StuffsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: {
        type: String,
        optional: true,
      },
      quantity: {
        type: Number,
        optional: true,
      },
      owner: String,
      status: {
        type: String,
        allowedValues: ['unclaimed', 'claimed', 'stored', 'disposed'],
        defaultValue: 'unclaimed',
      },
      type: {
        type: String,
        allowedValues: ['A mass of netting and/or fishing gear', 'An abandoned/derelict boat', 'A container/drum/cylinder', 'A large concentration of plastics', 'Potential Japan tsunami marine debris', 'Other'],
        defaultValue: 'A mass of netting and/or fishing gear',
      },
      located: {
        type: String,
        allowedValues: ['At sea, BEYOND three miles from ' +
        'nearest land', 'At sea, WITHIN three miles of nearest land', 'In the shore break', 'On the beach BELOW the high wash of the waves', 'On the beach ABOVE the high wash of the waves', 'Other'],
        defaultValue: 'At sea, BEYOND three miles from nearest land',
      },
      describe: {
        type: String,
        allowedValues: ['caught on the reef or is ' +
        'partially buried in sand', 'loose in the shore ' +
        'break or on the shoreline and could go ' +
        'back out to sea', 'trapped in a tide pool and ' +
        'cannot escape', 'loose on the shore but caught in ' +
        'the vegetation line', 'tied to a fixed object so it cannot be swept away', 'pushed inland above the high wash of the waves so it cannot be swept away', 'Other'],
        defaultValue: 'caught on the reef or is partially buried in sand',
      },
      island: {
        type: String,
        allowedValues: ['Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai', 'Lanai', 'Kahoolawe', 'Niihau'],
        defaultValue: 'Oahu',
      },
      image: {
        type: String,
        optional: true,
      },
      eventId: {
        type: String,
        optional: true,
      },
      sampleIds: {
        type: Array,
        optional: true,
      },
      'sampleIds.$': {
        type: String,
      },
      hasSamples: {
        type: Boolean,
        optional: true,
      },
      protocol: {
        type: Number,
        optional: true,
      },
      facility: {
        type: String,
        optional: true,
      },
      customTypeDescription: {
        type: String,
        optional: true,
      },
      customLocatedDescription: {
        type: String,
        optional: true,
      },
      customDescriptionDescription: {
        type: String,
        optional: true,
      },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
    this.unclaimed = `${this.name}.publication.unclaimed`;
    this.claimed = `${this.name}.publication.claimed`;
    this.stored = `${this.name}.publication.stored`;
    this.disposed = `${this.name}.publication.disposed`;
    this.analysis = `${this.name}.publication.analysis`;
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {StuffsCollection}
 */
export const Stuffs = new StuffsCollection();
