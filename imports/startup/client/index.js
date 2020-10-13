import { Template }  from 'meteor/templating';
import moment from 'moment';

import { Attorneys } from '../../api/attorneys.js';

import '/client/main.html';

/**
 * HELPERS
 */

// Register Date format helper
Template.registerHelper('formatDate', function(unixTimeStamp) {
    // js takes dates in milliseconds
    var date = new Date(unixTimeStamp * 1000);
    return moment(date).format('MM-DD-YYYY');
});

Template.recentlyUpdated.helpers({
  recentUpdates(count) {
    return Attorneys
        .find({}, {
          fields: { name: 1, role: 1, state: 1 },
          sort: { '_id' : -1 },
          limit: 5
        }).fetch();
  }
})

Template.attorneyView.helpers({
  Attorneys() {
    return Attorneys.find().fetch();
  }
});

//home-hero number counter
Template.homeHero.helpers({
  number(){
    return Attorneys.find().fetch().length;
  }
})

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

// TBD
Meteor.call("getPoliceDonation", function(error, result) {
  let {signed,declinedToSign,noResponse} = result;
});
