import { Meteor } from 'meteor/meteor';

import '../imports/api/attorneys.js';

Meteor.startup(() => {

});

Meteor.publish('Attorneys', function(limit) {
  Meteor._sleepForMs(2000);
  return Attorneys.find({});
});
