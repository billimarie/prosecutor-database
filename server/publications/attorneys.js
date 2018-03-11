import { check } from 'meteor/check'; // NOTE: double-"check" ;) if this is needed

import { Attorneys } from '../../imports/api/attorneys.js';

Meteor.publish('Attorneys', function( search ) {

    check( search, Match.OneOf( String, null, undefined ));

    let query = {},
        projection = { limit: 10, sort: { name: 1 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );

      query = {
        $or: [
          { name: regex },
          { role: regex },
          { state: regex }
        ]
      };

      projection.limit = 100;

    }

    return Attorneys.find( query, projection );
});
