import {Mongo} from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

export const Attorneys = new Mongo.Collection('Attorneys');

if (Meteor.isServer) {
    Attorneys._ensureIndex({
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
    },
    'race': {
        type: String,
        label: 'The race of this attorney.'
    },

});

Attorneys.attachSchema(AttorneysSchema);
