import { Mongo } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

export const Attorneys = new Mongo.Collection( 'Attorneys' );

if ( Meteor.isServer ) {
  Attorneys._ensureIndex( {
    name: 1,
    role: 1,
    state: 1
  });
}

Attorneys.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Attorneys.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let AttorneysSchema = new SimpleSchema({
  'name': {
    type: String,
    label: 'The name of this attorney.'
  },
  'role': {
    type: String,
    label: 'The role of this attorney.'
  },
  'state': {
    type: String,
    label: 'The state of this attorney.'
  }
});

Attorneys.attachSchema( AttorneysSchema );

// itemTemplate references the format for a single Attorney,
// templateName references the page that the paginated items
// are located in
// If settings are to be changed later on (like in the filters),
// have to say so in the availableSettings attribute.
// changing sort and perPage could be implemented in future?
export const AttorneyPages = new Meteor.Pagination(Attorneys, {
  templateName: "paginatedAttorneys",
  itemTemplate: "prosecutorItem",
  perPage: 10,
  sort: {
    name: 1
  },
  availableSettings: {
    filters: true,
    sort: true,
    perPage: true
  }
});