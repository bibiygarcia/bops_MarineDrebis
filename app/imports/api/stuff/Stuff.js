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
      name: String,
      quantity: Number,
      owner: String,
      status: {
        type: String,
        allowedValues: ['unclaimed', 'claimed', 'stored', 'disposed'],
        defaultValue: 'unclaimed',
      },
      sampleIds: {
        type: Array,
        optional: true,
      },
      'sampleIds.$': {
        type: String,
      },
      facility: String,
      type: String,
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
