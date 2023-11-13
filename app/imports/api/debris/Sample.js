import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The SampleCollection. It encapsulates state and variable values for sample.
 */
class SamplesCollection {
  constructor() {
    // The name of this collection.
    this.name = 'SamplesCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: String,
      owner: {
        type: String,
        optional: true,
      },
      event_id: String,
      sample_id: String,
      subsampleIds: {
        type: Array,
        optional: true,
      },
      'subsampleIds.$': {
        type: String,
      },
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
    this.analysis = `${this.name}.publication.analysis`;
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {SamplesCollection}
 */
export const Samples = new SamplesCollection();
