import { check } from 'meteor/check'; // NOTE: double-"check" if this is needed
import { HTTP } from 'meteor/http'; // Required for scraping data
import { Attorneys } from '../../imports/api/attorneys.js';

var cheerio = Npm.require('cheerio');

Meteor.methods({
    getPoliceDonation: function () {
        signedPage = HTTP.get("https://dumpcopcash.com/");
        $ = cheerio.load(signedPage.content);
        var signed = $('ul.blocks-gallery-grid > li.blocks-gallery-item:nth-child(n) > figure > img').map((i,x) => $(x).attr('data-image-title').split('_')[1]).get();

        declinedToSignPage = HTTP.get("https://dumpcopcash.com/decliners-and-alternative-responses/");
        $ = cheerio.load(declinedToSignPage.content);
        var declinedToSign = $('div.entry-content > div.wp-block-media-text:nth-child(n) > figure > img').map((i,x) => $(x).attr('data-image-title').split('_')[1]).get();

        noResponsePage = HTTP.get("https://dumpcopcash.com/decliners/");
        $ = cheerio.load(noResponsePage.content);
        var noResponse = $('ul.blocks-gallery-grid > li.blocks-gallery-item:nth-child(n) > figure > img').map((i,x) => $(x).attr('data-image-title').split('_')[1]).get();

        return {signed,declinedToSign,noResponse};
    }
});

/**
 * CURRENT ATTORNEY
 */
Meteor.publish('Attorneys', function( currentAttorney ) {
  return Attorneys.find({ name: currentAttorney });
});
/**
 * SEARCH
 */
Meteor.publish('searchAttorneys', function( search ) {

    check( search, Match.OneOf( String, null, undefined ));

    let query = {},
        projection = { sort: { name: 1 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );

      query = {
        $or: [
          { name: regex },
          { role: regex },
          { state: regex }
        ]
      };

      // projection.limit = 100;

    }

    return Attorneys.find( query, projection );
});
