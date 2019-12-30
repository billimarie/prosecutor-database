import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Attorneys, AttorneyPages } from '../../api/attorneys.js';

import '/client/main.html';

/**
 * HELPERS
 */

 // have to manipulate the Pagination object (AttorneyPages), not
 // the collection (Attorneys) itself for the collection to be
 // properly filtered
Template.currentProsecutors.events({
  'click .filterBtn': function(e) {
    var attorneyType = e.target.value;
    if (attorneyType === "Attorney General") {
      return AttorneyPages.set({
        filters: {
          role: "Attorney General"
        }
      });
    } else if (attorneyType === "US Attorney") {
      return AttorneyPages.set({
        filters: {
          role: "US Attorney"
        }
      });
    } else if (attorneyType === "District Attorney") {
      return AttorneyPages.set({
        filters: {
          role: "District Attorney"
        }
      });
    } else if(attorneyType === "Municipal Attorney") {
      return AttorneyPages.set({
        filters: {
          role: "Municipal Attorney"
        }
      });
    }
    // "View All" selected
    else {
      return AttorneyPages.set({
        filters: {}
      })
    }
  }
})

// reference the items to be paginated (prosecutorItem)
// not entirely sure how this would affect the recentAttorneys
// functionality
Template.prosecutorItem.helpers({
  allAttorneys() {
    return Attorneys.find().fetch();
  },
  recentAttorneys() {
    return Attorneys.find( {}, {
        sort: { timestamp : 1 },
        limit: 6
      }).fetch();
    // dateExists(date) {
    //   return date !== null;
    // },
    // unixToMMddYYYY(unix) {
    //   var month = new Date(appointed * 1000).getMonth();
    //   var day = new Date(appointed * 1000).getDate();
    //   var year = new Date(appointed * 1000).getFullYear();
    //   return month + '-' + date + '-' + year;
    // }
  }
});

Template.attorneyView.helpers({
  Attorneys() {
    return Attorneys.find().fetch();
  }
});

/**
 * ROUTES
 */

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/:state/:role/:name', {
  name: 'attorneyView',
  template: 'attorneyView',
  data: function() {
    return Attorneys.findOne( { name: this.params.name } );
  },
  waitOn: function() {
    return Meteor.subscribe('Attorneys', this.params.name);
  }
});

Router.route('/about', {
  name: 'about',
  template: 'about'
});

Router.route('/contributors', {
  name: 'contributors',
  template: 'contributors'
});

Router.route('/glossary', {
  name: 'glossary',
  template: 'glossary'
});

Router.configure({
  layoutTemplate: 'main'
});
